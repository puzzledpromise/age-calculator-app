const btnCalculate = document.getElementById('btn-calculate');
const dayCount = document.getElementById('day-count');
const monthCount =document.getElementById('month-count');
const yearCount = document.getElementById('year-count');
const dayInput = document.getElementById('day-input');
const monthInput = document.getElementById('month-input');
const yearInput = document.getElementById('year-input');



// Code attribution for this: https://stackoverflow.com/questions/17732897/difference-between-two-dates-in-years-months-days-in-javascript
function dateDiff(startingDate, endingDate) {
    let startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
    startDate.setDate(startDate.getDate() + 1);


    if (!endingDate) {
        endingDate = new Date().toISOString().substr(0, 10); // need date in YYYY-MM-DD format
    }
    let endDate = new Date(endingDate);
    if (startDate > endDate) {
        const swap = startDate;
        startDate = endDate;
        endDate = swap;
    }
    const startYear = startDate.getFullYear();
    const february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
    const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let yearDiff = endDate.getFullYear() - startYear;
    let monthDiff = endDate.getMonth() - startDate.getMonth();
    if (monthDiff < 0) {
        yearDiff--;
        monthDiff += 12;
    }
    let dayDiff = endDate.getDate() - startDate.getDate();
    if (dayDiff < 0) {
        if (monthDiff > 0) {
            monthDiff--;
        } else {
            yearDiff--;
            monthDiff = 11;
        }
        dayDiff += daysInMonth[startDate.getMonth()];
    }
    return {years: yearDiff, months: monthDiff, days:  dayDiff};
}




function showDateDiff(){
    clearErrors();
    resetFields();
    const status = validate();

    if(!status){
        return;
    };


    let year;
    try{
        year = parseInt(yearInput.value);
    }catch(error){
        document.getElementById('year-label').classList.add('error');
       document.getElementById('year-input').classList.add('error');
       document.getElementById('year-error').style.visiblity = 'visible';
    }
    const month = parseInt(monthInput.value) -1;
    const day = parseInt(dayInput.value);

    const date = new Date(year, month, day);
    const  today = new Date();
    const result = dateDiff(date, today);

    dayCount.innerText = `${result.days}`;
    monthCount.innerText = `${result.months}`;
    yearCount.innerText = `${result.years}`;
}

function clearErrors(){
    for(const focus of ['day', 'month', 'year']){
        document.getElementById(`${focus}-label`).classList.remove('error');
        document.getElementById(`${focus}-input`).classList.remove('error');
        document.getElementById(`${focus}-error`).style.visibility = 'hidden';
    }
}

function resetFields(){
    for(const focus of ['day', 'month', 'year']){
        document.getElementById(`${focus}-count`).innerText = '--';
    }
}
function isEmpty(unit){
    if(!unit in ['day','month', 'year']){
        return true;
    }
    return document.getElementById(`${unit}-input`).value === '';
}

function isNumber(unit){
    if(!unit in ['day','month', 'year']){
        return
    }
    const value = parseInt(document.getElementById(`${unit}-input`).value);
    return ! isNaN(value);
}

function isLowerBoundary(unit, lower){
    const value = parseInt(document.getElementById(`${unit}-input`).value);
    return value >= lower;

}

function isUpperBoundary(unit,upper){
    const value = parseInt(document.getElementById(`${unit}-input`).value);
    return value <= upper;
}

function isLeapYear(year) {
    if (year % 4 !== 0) {
        return false;
    } else if (year % 100 !== 0) {
        return true;
    } else if (year % 400 !== 0) {
        return false;
    } else {
        return true;
    }
}

function setError(unit, message){
    document.getElementById(`${unit}-label`).classList.add('error');
    document.getElementById(`${unit}-input`).classList.add('error');
    document.getElementById(`${unit}-error`).innerText= message;
    document.getElementById(`${unit}-error`).style.visibility = 'visible';
}


function validate(){
    let hasError = false;

    if(isEmpty('day')) {
        setError('day', 'Day invalid!');
        hasError = true;
    }
    if(isEmpty('month')) {
        setError('month', 'Month invalid!');
        hasError = true;
    }
    if(isEmpty('year')) {
        setError('year', 'Year invalid!');
        hasError = true;
    }

    if(!isNumber('day')) {
        setError('day', 'Day invalid!');
        hasError = true;
    }
    if(!isNumber('month')) {
        setError('month', 'Month invalid!');
        hasError = true;
    }
    if(!isNumber('year')) {
        setError('year', 'Year invalid!');
        hasError = true;
    }

    if(!isLowerBoundary('day', 1)){
        setError('day', 'Day invalid!');
        hasError = true;
    }

    if(!isLowerBoundary('month', 1)){
        setError('month', 'Month invalid!');
        hasError = true;
    }

    if(!isLowerBoundary('year', 1900)){
        setError('year', 'Year invalid!');
        hasError = true;
    }

    if(!isUpperBoundary('day', 31)){
        setError('day', 'Day invalid!');
        hasError = true;
    }

    if(!isUpperBoundary('month', 12)){
        setError('month', 'Month invalid');
        hasError = true;
    }

    if(!isUpperBoundary('year', new Date().getFullYear())){
        setError('year', 'Year invalid!')
        hasError = true;
    }

    const dayValue = parseInt(dayInput.value);
    const monthValue = parseInt(monthInput.value);
    const yearValue = parseInt(yearInput.value);



    if(monthValue == 2){
        let upperDay = 28;
        if(isLeapYear(yearValue)){
            upperDay = 29;
        }

        if(!isUpperBoundary('day', upperDay)){
            setError('day', `Day invalid!`)
            hasError = true;
        }
    }

    if(new Date(yearValue, monthValue - 1, dayValue) > new Date()){
        setError('year', 'In the future!');
        hasError = true;
    }


    return ! hasError;
}


function init(){
    resetFields();
    clearErrors();
}

btnCalculate.addEventListener('click', showDateDiff);
document.addEventListener('DOMContentLoaded', init);

