document.addEventListener("DOMContentLoaded", function() {
    const supabaseUrl = 'https://hpwualfqrjwhhsfwhlou.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwd3VhbGZxcmp3aGhzZndobG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDczNzIsImV4cCI6MjA3MTI4MzM3Mn0.sH2ugpVjWRXaQ4X4OZEzRnWOmE1iSVOQgEc07DHOqWw';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    const selectedMeals = JSON.parse(localStorage.getItem("meals")) || [];
    const selectedPrices = JSON.parse(localStorage.getItem("prices")) || [];
    const para = document.getElementById("order_prorp");
    let total = 0;

    selectedMeals.forEach((meal, index) => {
        para.innerHTML += meal + ": " + selectedPrices[index] + "<br>";
    });

    selectedPrices.forEach((price) => {
        total += parseInt(price.replace("₪", "").trim());
    });

    para.innerHTML += "סכום ביניים: " + total + "₪<br>";
    para.innerHTML += "דמי משלוח : 15₪<br>";
    para.innerHTML += "סה\"כ לתשלום: " + (total + 15) + "₪";

    function getRadioValue(name) {
        const ele = document.getElementsByName(name);
        for (let i = 0; i < ele.length; i++) {
            if (ele[i].checked) return ele[i].value;
        }
        return null;
    }

    const form = document.getElementById('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const tel = document.getElementById('tel').value;
        const time = document.getElementById('time').value;
        const address = {
            city: document.getElementById("city").value,
            street: document.getElementById("street").value,
            house: document.getElementById("house").value,
            mikod: document.getElementById("mikod").value
        };
        const branch = getRadioValue('branche');

        
        try {
            const { data, error } = await supabaseClient
                .from('order')
                .insert([{ name, tel, time, address, branch, total, selectedMeals }]);

            if (error) {
                console.error('Error:', error.message);
            } else {
                console.log('Message sent!', data);
                form.reset();
                alert("הזמנתך התקבלה!")
                window.open("./index.html", "_top")
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    });
});
