var prev = "0+";
var curr = "";
var point = false;


function typed(event){
    event.preventDefault();

    if(event.key=="Backspace"){
        backspace();
        return;
    }

    let ops = ["+", "-", "*", "/", "%", "."];
    let key = event.key;
    let code = key.charCodeAt(0);
    // console.log(code);

    if(key=="Enter"){
        result();
        return
    }

    if((code>=48 && code<=57) || (ops.includes(key))) {
        display(key);
    }
}

function display(val) {
    if(document.getElementById('prev').value.slice(-1)=="="){
        document.getElementById('prev').value = "";
    }

    if (val=="+" || val=="-" || val=="*" || val=="/" || val=="%") {
        if(curr=="") {
            curr=0;
        }
        prev = eval(prev+curr);
        document.getElementById('display').value = prev
        prev+=val;
        document.getElementById('prev').value = prev;
        curr = "";
        point = false;
        
    }
    else if(val=="."){
        if(!point){
            if(curr=="") {
                curr="0";
            }
            curr+=val;
            document.getElementById('display').value = curr;
            point=true;
        }
    }
    else{
        curr+=val;
        document.getElementById('display').value = curr;
    }
}

function clr() {
    curr = "";
    prev = "0+";
    document.getElementById('prev').value = "";
    document.getElementById('display').value = 0;
    point = false;
}

function clrEntry() {
    curr = "";
    document.getElementById('display').value = 0;
    point = false;
}

function backspace(){
    if (curr.length>0){
        if (curr.slice(-1) == "."){
            point = false;
        }
        curr = curr.slice(0,-1);
        if (curr.length==0) {
            document.getElementById('display').value = 0;
        }
        else{
            document.getElementById('display').value = curr;
        }
    }
}


function plusOrMinus() {
    if (curr!="") {
        curr= Number(curr)* -1;
        document.getElementById('display').value=curr;
    }
}

function root() {
    curr = Math.sqrt(Number(curr));
    document.getElementById('display').value=curr;
}



function byX(){
    if(curr=="") {
        curr = document.getElementById('display').value;
    }
    curr = 1/Number(curr);
    document.getElementById('display').value = curr;
}


// equal

function result(){
    if(document.getElementById('prev').value.slice(-1)=="="){
        let exp = document.getElementById('prev').value;
        // console.log("exp = ", exp);
        let val = document.getElementById('display').value;
        // console.log("val = ", val);
        let i=0;

        while(i<exp.length){
            if (i!=0 &&(exp[i]=="+" || exp[i]=="-" || exp[i]=="*" || exp[i]=="/" || exp[i]=="%")) {
                break;
            }
            i+=1;
        }

        exp = val + exp.slice(i);
        // console.log("exp1 = ", exp);
        document.getElementById('prev').value = exp;

        let ans = eval(exp.substring(0, exp.length-1));
        document.getElementById('display').value = ans;

        curr="";
        prev="0+";
    }
    else{
        prev = prev+curr+"=";
        document.getElementById('prev').value = prev;

        let ans = eval(prev.substring(0,prev.length-1));
        document.getElementById('display').value = ans;

        curr = "";
        prev = "0+";
    }
    point = false;
}





// memory
var mem = 0;
var events = false;

function memSave(){
    mem = document.getElementById('display').value;
    if(!events) {
        document.getElementById('mem-recall').addEventListener('click', memRecall);
        document.getElementById('mem-clr').addEventListener('click', memClr);
        events = true;

        document.getElementById("mem-recall").classList.remove('btn-opac');
        document.getElementById("mem-clr").classList.remove('btn-opac');
    }
}

function memRecall() {
    clr();
    document.getElementById('display').value = mem;
}

function memClr() {
    mem = 0;
    document.getElementById('mem-recall').removeEventListener('click', memRecall);
    document.getElementById('mem-clr').removeEventListener('click', memClr);
    events = false;

    document.getElementById("mem-recall").classList.add('btn-opac');
    document.getElementById("mem-clr").classList.add('btn-opac');
}

function mPlus() {
    mem= Number(mem)+Number(document.getElementById('display').value);
    if(!events){
        document.getElementById('mem-recall').addEventListener('click', memRecall);
        document.getElementById('mem-clr').addEventListener('click', memClr);
        events = true;

        document.getElementById("mem-recall").classList.remove('btn-opac');
        document.getElementById("mem-clr").classList.remove('btn-opac');
    }
}

function mMinus() {
    mem-=Number(document.getElementById('display').value);
    if(!events){
        document.getElementById('mem-recall').addEventListener('click', memRecall);
        document.getElementById('mem-clr').addEventListener('click', memClr);
        events = true;

        document.getElementById("mem-recall").classList.remove('btn-opac');
        document.getElementById("mem-clr").classList.remove('btn-opac');
    }
}
