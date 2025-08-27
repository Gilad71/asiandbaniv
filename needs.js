function getRadioValue(name) {
    const ele = document.getElementsByName(name);
    for (let i = 0; i < ele.length; i++) {
        if (ele[i].checked) return ele[i].value;
    }
    return null;
}
document.addEventListener("DOMContentLoaded", function() {
    const supabaseUrl = 'https://hpwualfqrjwhhsfwhlou.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwd3VhbGZxcmp3aGhzZndobG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDczNzIsImV4cCI6MjA3MTI4MzM3Mn0.sH2ugpVjWRXaQ4X4OZEzRnWOmE1iSVOQgEc07DHOqWw';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


    const form = document.getElementById('needForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const tel = document.getElementById('tel').value;
        const email = document.getElementById('email').value;
        const branch = getRadioValue('branche');
        const job = getRadioValue('type');

        
        try {
            const { data, error } = await supabaseClient
                .from('needs')
                .insert([{name, tel, email, job, branch}]);

            if (error) {
                console.error('Error:', error.message);
            } else {
                console.log('Message sent!', data);
                form.reset();
                alert("בקשתך נשלחה וניצור עמך קשר בהקדם")
                window.open("./index.html", "_top")
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    });
});
