// Forms to add event listeners
const setForm = document.getElementById("set-form");
const addForm = document.getElementById("add-form");
const insertForm = document.getElementById("insert-form");
const removeForm = document.getElementById("remove-form");
// Index and data values
const setIndex = document.getElementById("set-index");
const setData = document.getElementById("set-data");
const addData = document.getElementById("add-data");
const insertIndex = document.getElementById("insert-index");
const insertData = document.getElementById("insert-data");
const removeIndex = document.getElementById("remove-index");
// Errors containers
const setErrors = document.querySelectorAll("#set-form .error-container");
const addError = document.querySelector("#add-form .error-container");
const insertErrors = document.querySelectorAll("#insert-form .error-container");
const removeError = document.querySelector("#remove-form .error-container");

const animationContainer = document.querySelector(".animation-container")
// Getting CSS variables
var root = document.querySelector(':root');
var rootStyles = getComputedStyle(root);
var animationDuration=parseInt(rootStyles.getPropertyValue('--varAnimationDuration').slice(0,-2));


var linkedlist = []
async function accessAnim(el){
    await el.animate([
        {transform: "scale(1)", offset:0},
        {transform: "scale(1.2)", offset:.5},
        {transform: "scale(1)", offset:1}
    ], {
        duration: animationDuration,
        easing: "ease-in-out",
    }).finished
}
async function appearAnim(el, dir="normal"){
    await el.animate([
        {transform:"scale(0)", offset:0},
        {transform:"scale(1.2)", offset:.5},
        {transform:"scale(1)", offset:1}
    ], {
        duration: animationDuration,
        fill:"forwards",
        easing: "ease-in",
        direction:dir
    }).finished
}
async function rotateAppearAnim(el, dir="normal"){
    await el.animate([
        {transform:"scale(0) rotate(-30deg)", offset:0},
        {transform:"scale(1.2) rotate(30deg)", offset:.7},
        {transform:"scale(1) rotate(0)", offset:1}
    ], {
        duration: animationDuration,
        fill:"forwards",
        easing: "ease-in",
        direction:dir
    }).finished
}
async function updateAnim(el, dat){
    setTimeout(()=>{
        el.innerText=dat
    }, animationDuration)
    await el.animate([
        {transform: "scale(1)", offset:0},
        {background:"lawngreen", offset:0.2},
        {transform: "scale(1.2)", offset:.5},
        {background:"lawngreen", offset:0.8},
        {transform: "scale(1)", offset:1}
    ], {
        duration: animationDuration*2,
        easing: "ease-in-out",
    }).finished
}
function forwardAnim(el, dir){
    let dist=138
    return el.animate([
        {transform: "translateX(0px)", offset:0},
        {transform: "translateX(" + dist +"px)", offset:1}
    ], {
        duration: animationDuration,
        easing: "ease-in-out",
        direction:dir
    }).finished
}
async function chainAnimation(idx){
    for (let i = 0; i < idx;i++){
        await accessAnim(linkedlist[i])
        let arrow = animationContainer.children.item(i*2+1)
        await accessAnim(arrow)
    }
}
async function createSpace(idx, dir="normal"){
    let lastFinished
    for (let i = idx; i <linkedlist.length;i++){
        forwardAnim(linkedlist[i], dir)
        lastFinished=forwardAnim(animationContainer.children.item(i*2+1), dir)
    }
    await lastFinished
}
function createVar(data){
    const variable = document.createElement("div")
    variable.innerText=data
    variable.classList.add("variable")
    return variable
}
function createArrow(){
    const arrow = document.createElement("i")
    arrow.classList.add("fa-solid", "fa-arrow-right-long")
    return arrow
}
async function linkedListSet(idx, dat){
    await chainAnimation(idx)
    await updateAnim(linkedlist[idx], dat)
}
async function linkedListAdd(dat){
    const variable=createVar(dat)
    const arrow=createArrow()
    linkedlist[linkedlist.length]=variable
    animationContainer.appendChild(variable)
    animationContainer.appendChild(arrow)
    await chainAnimation(linkedlist.length)
    variable.style.display="flex"
    arrow.style.display="block"
    await appearAnim(variable)
    await rotateAppearAnim(arrow)
}
async function linkedListInsert(idx, dat){
    const variable=createVar(dat)
    const arrow=createArrow()
    animationContainer.insertBefore(variable, linkedlist[idx])
    animationContainer.insertBefore(arrow, linkedlist[idx])
    linkedlist.splice(idx,0,variable)
    await chainAnimation(idx)
    await createSpace(idx)
    variable.style.display="flex"
    arrow.style.display="block"
    await appearAnim(variable)
    await rotateAppearAnim(arrow)
}
async function linkedListRemove(idx){
    await chainAnimation(idx)
    let arrow=animationContainer.children.item(removeIndex.value*2+1)
    let variable=linkedlist[idx]
    await rotateAppearAnim(arrow, "reverse")
    await appearAnim(variable, "reverse")
    variable.style.display="none"
    arrow.style.display="none"
    await createSpace(idx, "reverse")
    animationContainer.removeChild(variable)
    animationContainer.removeChild(arrow)
    linkedlist.splice(idx,1)

}
setForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (setFormValid(setIndex.value, setData.value, setErrors)){
        linkedListSet(setIndex.value, setData.value)
    }
})
addForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (addFormValid(addData.value, addError)){
        linkedListAdd(addData.value)
    }
})
insertForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (insertFormValid(insertIndex.value, insertData.value, insertErrors)){
        linkedListInsert(insertIndex.value, insertData.value)
    }
})
removeForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (removeFormValid(removeIndex.value, removeError)){
        linkedListRemove(removeIndex.value)
    }
})