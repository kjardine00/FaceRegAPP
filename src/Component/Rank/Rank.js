import React from 'react';


const Rank = ({ loadUser }) => {
    let name = loadUser.name;
    let rank = loadUser.entries;
    return (
        <div>
            <div className='white f3'>
                {name + ' your current rank is...'}
            </div>
            <div className='white f1'>
                {'#' + rank}
            </div>
        </div>
    );
}

export default Rank;