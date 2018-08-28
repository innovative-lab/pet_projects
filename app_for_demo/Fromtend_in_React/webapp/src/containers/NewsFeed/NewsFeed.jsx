import React from 'react';

import classes from './NewsFeed.css';
import NewsFeedContainer from '../../components/UI/NewsFeedContainer/NewsFeedContainer';
import Gallery from '../../components/Gallery/Gallery';
import Loader from '../../components/UI/Loader/Loader';

const NewsFeedTemplate = (scope) => {
    return (
        <div className={classes.NewsFeedTemplate}>
            <div className={classes.NewsFeedTemplate__content}>
                <NewsFeedContainer>
                    <input placeholder='Search' />
                </NewsFeedContainer>
                <NewsFeedContainer>
                    <Gallery data={scope.galleryData} />
                </NewsFeedContainer>
                <NewsFeedContainer>
                    <div >
                        <Loader margin='auto'/>
                    </div>
                </NewsFeedContainer>
            </div>

        </div>
    )
};

export default NewsFeedTemplate;