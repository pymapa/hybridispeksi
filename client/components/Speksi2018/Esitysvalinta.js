import React, { Component } from 'react'

import Moment from 'react-moment';

import styles from './Speksi2018.css';

class Esitysvalinta extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let esitykset = this.props.esitykset.map((esitys, i) => {
            let tilaa = '';
            let esitystd;
            if (esitys.bookingCount < 100){
                tilaa = "Tilaa";
            }
            else if(esitys.bookingCount < 130) {
                tilaa = "Lähes täynnä";
            }
            else {
                tilaa = "Täynnä";
            }


            return (
                <tr key={i}>
                    <td className={tilaa === "Täynnä" ? styles.showTdFull : styles.showTd}
                        onClick={() => this.props.toggleUusiVarausModal(esitys, tilaa)}>
                        {esitys.name} klo <Moment format="HH.mm">{esitys.date}</Moment>
                    </td>
                    <td className={tilaa === "Täynnä" ? styles.showTdFull : styles.showTd}
                        onClick={() => this.props.toggleUusiVarausModal(esitys, tilaa)}>
                        <i>{tilaa}</i>
                    </td> 
                </tr>
            )
        })
        
        return (
            <div>
                <table className="table table-hover table-sm">
                    <tbody>
                        {esitykset}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Esitysvalinta