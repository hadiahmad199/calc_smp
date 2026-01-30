const loginbtn = document.getElementById('loginbtn')




//getting data
/*async function loadData() {
     
    const usernameinpt = document.getElementById('usernameinpt')

    const id = usernameinpt.value;
    try{
    const response = await fetch(`/api/users/${id}`);
    
    if(!response.ok){
        throw new Error("server wrong or not found user");
    }

    const data = await response.json(); //turns json languag to lang that js anderstand
    
    // طباعة البيانات في صفحة الـ HTML
    const output = document.getElementById('logintxt')
    if (output) {
        output.textContent = data.username || JSON.stringify(data);//turns json data into readable data
    }
    }catch(error){
        console.error("ops", error); 
    }
}

loginbtn.addEventListener("click", function(){
    loadData();
})*/



async function INSERTdata() {

    const usernameinpt = document.getElementById("usernameinpt");
    const emailinpt = document.getElementById("emailinpt");
    const passwordinpt = document.getElementById("passwordinpt")
    

    const userdata = {
        username: usernameinpt.value,
        email: emailinpt.value,
        password: passwordinpt.value
    } ;

    try{
        const response = await fetch(`/api/users`,{ 
            method : 'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(userdata)
        });
        
        if(response.ok){
            const result = await response.json();
            console.log('good connection', result);
        }
    }catch(error){
        console.error('oppss', error)
    };
};

loginbtn.addEventListener("click", function(){
    INSERTdata()
})