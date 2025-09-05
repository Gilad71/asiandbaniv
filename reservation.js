document.addEventListener('DOMContentLoaded', () => {
  const supabaseUrl = 'https://hpwualfqrjwhhsfwhlou.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwd3VhbGZxcmp3aGhzZndobG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDczNzIsImV4cCI6MjA3MTI4MzM3Mn0.sH2ugpVjWRXaQ4X4OZEzRnWOmE1iSVOQgEc07DHOqWw';
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

  const tables = Array.from({ length: 36 }, (_, i) => i + 1);
  const timeInput = document.getElementById('time');
  const branchRadios = Array.from(document.getElementsByName('branche'));
  const form = document.getElementById('resForm');

  // מחזיר שולחנות תפוסים לפי סניף ושעה
  async function getBusyTables(branch, time) {
    const formattedTime = time.length === 5 ? time + ':00' : time;

    const { data, error } = await supabaseClient
      .from('reservation')
      .select('table')
      .eq('branch', branch)
      .eq('time', formattedTime);

    if (error) {
      console.error(error);
      return [];
    }

    let busy = [];
    data.forEach(r => {
      if (Array.isArray(r.table)) busy.push(...r.table.map(Number));
      else if (typeof r.table === 'string') busy.push(...JSON.parse(r.table).map(Number));
    });

    return busy;
  }

  // מחזיר שולחנות פנויים לפי סניף ושעה
  async function getAvailableTables(branch, time) {
    const busy = await getBusyTables(branch, time);
    return tables.filter(t => !busy.includes(t));
  }

  // החזרת ערך רדיו
  function getRadioValue(name) {
    const radios = document.getElementsByName(name);
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return null;
  }

  // טיפול בשליחת טופס
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const tel = document.getElementById('tel').value.trim();
    const guests = parseInt(document.getElementById('nop').value);
    const rawTime = timeInput.value;
    const time = rawTime.length === 5 ? rawTime + ':00' : rawTime;
    const branch = getRadioValue('branche');

    if (!name || !tel || !guests || !time || !branch) {
      alert('אנא מלא את כל השדות');
      return;
    }

    const available = await getAvailableTables(branch, time);
    const neededTables = Math.ceil(guests / 4);

    if (available.length < neededTables) {
      alert('אין מספיק שולחנות פנויים בשעה שבחרת.');
      return;
    }

    // בוחרים את השולחנות הראשונים הפנויים
    const table = available.slice(0, neededTables);

    // בדיקה חוזרת שלא נתפסו שולחנות בינתיים
    const updatedAvailable = await getAvailableTables(branch, time);
    const stillAvailable = table.every(t => updatedAvailable.includes(t));
    if (!stillAvailable) {
      alert('אחד מהשולחנות כבר תפוס, נסה שוב.');
      return;
    }

    // שמירת ההזמנה
    const { error } = await supabaseClient
      .from('reservation')
      .insert([{ name, tel, guests, time, branch, table }]);

    if (error) {
      alert('שגיאה בהזמנה');
      console.error(error);
    } else {
      alert('הזמנתך נרשמה בהצלחה!');
    }
  });

  // עיגול שעות לפי 90 דקות
  timeInput.addEventListener('input', () => {
    const step = 5400; // 90 דקות בשניות
    const [hours, minutes] = timeInput.value.split(':').map(Number);
    let totalSeconds = hours * 3600 + minutes * 60;
    totalSeconds = Math.round(totalSeconds / step) * step;
    const newHours = Math.floor(totalSeconds / 3600);
    const newMinutes = (totalSeconds % 3600) / 60;
    timeInput.value = `${String(newHours).padStart(2,'0')}:${String(newMinutes).padStart(2,'0')}`;
  });
});
