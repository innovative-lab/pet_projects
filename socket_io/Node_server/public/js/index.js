(function () {
    var imageArray = [], percentArray = [];
    var initialAnimation = function () {
        imageArray.img1 = document.getElementById('image1');
        imageArray.img2 = document.getElementById('image2');
        imageArray.img3 = document.getElementById('image3');
        percentArray.load_percent1 = document.getElementById('load_percent1');
        percentArray.load_percent2 = document.getElementById('load_percent2');
        percentArray.load_percent3 = document.getElementById('load_percent3');
        var imgCount = 29;
        var imgSpace = 150;
        var heightPos, widthPos;
        var animateFunc = function (element, width = 150, height = 150) {
            for (let i = 1; i <= imgCount + 2; i++) {
                setTimeout(() => {
                    heightPos = i * height;
                    widthPos = width;
                    element.style.background = `url(./images/sprite_home.png) -${widthPos}px -${heightPos}px`;
                }, 50 * i)
            }
        }
        if (imageArray.img1) {
            animateFunc(imageArray.img1, 0);
        }
        if (imageArray.img2) {
            animateFunc(imageArray.img2, 150);
        }
        if (imageArray.img3) {
            animateFunc(imageArray.img3, 300);
        }
    }
    var socketSetUp = function () {
        var socket = io();
        socket.on('connect', () => {
            initialAnimation();
            console.log('Connected to server');
        })
        socket.on('disconnect', () => {
            console.log('Disonnected to server');
        })
        socket.on('updatedState', (newState) => {
            updateState(newState.data);
        })
    }
    var updateState = function (data) {
        var element, heightPos, percentage;
        for (let item of data) {
            element = 'img' + item.id;
            percentage = 'load_percent' + item.id;
            heightPos = 150 * item.percentage;
            imageArray[element].style.background = `url(./images/sprite_home.png) -${item.widthPos}px -${heightPos}px`;
            percentArray[percentage].innerText = Math.floor(item.percentage * 3.44) + '%';
        }
    };
    window.onload = function () {
        socketSetUp();
    };
})();