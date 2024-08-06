
async function submitted(event) {
    event.preventDefault();

    
    const formData = new FormData(myForm);
    // console.log(formData);

    const data = Object.fromEntries(formData.entries());
    // console.log(data);


    const hobbies = formData.getAll('hobbies');
    if (hobbies.length > 0) {
        data.hobbies = hobbies;
    } else {
        delete data.hobbies;
    }

    // console.log(data);
    if (data.age<0) {
        alert("age should be greater than 0");
        return;
    }

    if (pswd.value!==cpswd.value){
        alert("password in not matching");
        return;
    }

    data.income = data.income*20000/100;

    try {
        const response = await fetch('https://dummyjson.com/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            // console.log('Success:', result);
            alert('form submitted');
        }else{
            throw new Error('Network response was not ok');
        }

        

    } catch (error) {
        console.error('Error:', error);
    }
}














async function fetching() {
    // let url = "https://reqres.in/api/users/2";
    let url = "https://randomuser.me/api/";

    let response = await fetch(url);

    console.log(response);

    if (response.ok) {
        let json = await response.json();
        let data = json.results[0];
        // console.log("abc",data);

        document.getElementById("fname").value = data.name.first;
        document.getElementById("lname").value = data.name.last;
        document.getElementById("email").value = data.email;
        document.getElementById("pswd").value = data.login.password;
        document.getElementById("cpswd").value = data.login.password;
        document.getElementById("age").value = data.dob.age;


        // for(let hobbie in data.hobbies) {
        //     document.getElementById(hobbie).checked = true;
        // }

        let gender = data.gender;
        if(gender=="male"){
            document.getElementById("male").checked = true;
            document.getElementById("female").checked = false;
        }
        else{
            document.getElementById("female").checked = true;
            document.getElementById("male").checked = false;
        }



    } else {
        alert("HTTP-Error: " + response.status);
    }
}

window.onload = fetching;