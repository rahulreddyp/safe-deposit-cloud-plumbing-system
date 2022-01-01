import React from 'react';

class Visualize extends React.Component {
    render() {  
        return  (                       
        <div className="card text-center">
            <h4 className="card-header bg-dark text-white">SafeBox - Visualizations of Money Deposit </h4>
            <iframe height="900" title="Visualizations" src="https://datastudio.google.com/embed/reporting/aa4ffbfb-6290-40d1-93c1-7e4a02f152de/page/cIYhC" frameborder="0" style={{"border":"0"}} allowfullscreen></iframe>
       </div>
       )
    }
}

export default Visualize;