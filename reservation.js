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

// שימוש לדוגמה
getBusyTables('tel-aviv', '12:00').then(busy => console.log(busy));
