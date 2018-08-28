
var seatDetails, busDetails;
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            busDetails = JSON.parse(this.response);
            seatDetails = busDetails.seatDetails;
            renderHeader();
            renderBody();
        }
    };
    xhttp.open("GET", "http://192.168.0.8:8080/data.json", true);
    xhttp.send();
}

function renderHeader() {
    var busName = document.createElement('h2');
    busName.className = 'center-align';
    busName.innerHTML = busDetails.name;
    document.getElementsByClassName('head-info')[0].appendChild(busName);
}

function renderBody() {
    var seatHolder;
    document.getElementsByClassName('seat-layout')[0].innerHTML = '';
    seatDetails.forEach((itr, i) => {
        seatHolder = document.createElement('div');
        seatHolder.id = '__' + (i + 1);
        seatHolder.innerHTML = i + 1;
        if(itr.status === 'available'){
            seatHolder.className ="seat available";
        }else if(itr.status === 'selected'){
            seatHolder.className ="seat selected";
        }else{
            seatHolder.className ="seat booked";
        }
        seatHolder.onclick = componentClicked;
        document.getElementsByClassName('seat-layout')[0].appendChild(seatHolder);
    })
}

function componentClicked(event) {
    var seat_id = event.target.id;
    var seatDetailsHolder;
    document.getElementsByClassName('seat-info')[0].innerHTML = '';

    var clickedSeatDetails = seatDetails.find((itr) => {
        return '__' + itr.seat_no === seat_id;
    })

    seatDetailsHolder = document.createElement('div');
    seatDetailsHolder.className = 'seat-detail';
    seatDetailsHolder.innerHTML = `<div>
                                        <h3>seat-no : `+ clickedSeatDetails.seat_no + `</h3>
                                        <h5>status : `+ clickedSeatDetails.status + `</h5>
                                        <button class="book_seat" onClick=seatBooked(`+ clickedSeatDetails.seat_no + `,'booked')>Book Now</button>
                                        <button class="book_seat" onClick=seatBooked(`+ clickedSeatDetails.seat_no + `,'saved')>Save for later</button>
                                    </div>`
    document.getElementsByClassName('seat-info')[0].appendChild(seatDetailsHolder);

}
function seatBooked(seat_id, action) {
    seatDetails.forEach((itr) => {
        if (itr.seat_no === seat_id) {
            itr.status = action === 'booked' ? 'booked' : 'selected';
        }
    })
    renderBody();
}
// document.getElementsByClassName('seat').onClick((event)=>{
//     console.log(this);
// })
loadDoc();