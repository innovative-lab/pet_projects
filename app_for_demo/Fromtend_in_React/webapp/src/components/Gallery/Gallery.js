import React, { Component } from 'react';
import classes from './Gallery.css';
import axios from 'axios';
import Card from './Card/Card';
import Loader from '../UI/Loader/Loader';
class Gallery extends Component {
    state = {
        galleryData: null
    }
    componentDidMount() {
        this.getElementScroll();
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(res => {
                if (res.status == 200 && res.data) {
                    this.setGalleryData(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    };
    setGalleryData = (data) => {
        var filteredData = data.splice(0, 10);
        this.setState({
            galleryData: filteredData
        })
    }
    getElementScroll = () => {
        var scrollElement = document.getElementById('gallery');
        var prevState = scrollElement.scrollLeft;
        var nextState = 30;
        scrollElement.addEventListener('wheel', (event) => {
            if (prevState < nextState) {
                prevState = scrollElement.scrollLeft;
                scrollElement.scrollLeft += 30;
                nextState = scrollElement.scrollLeft;
            } else {
                prevState = scrollElement.scrollLeft;
                scrollElement.scrollLeft -= 30;
                nextState = prevState == 0 ? 30 : scrollElement.scrollLeft;
            }
        })
    }
    render() {
        var cards = <Loader margin='auto'/>;
        if (this.state.galleryData) {
            cards = this.state.galleryData.map(item => {
                return <Card key={item.id} data={item} />
            })
        }

        return (
            <div id="gallery"
                className={classes.gallery}>
                {cards}
            </div>
        )
    }
}

export default Gallery