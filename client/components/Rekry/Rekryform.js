import React, { Component } from 'react'

import styles from './Rekry.css';

class Rekry extends Component {
    render () {
        return (
            <div className={"container-fluid " + styles.container}>
                <div className={"row " + styles.banner}></div>

            	<div className={"row justify-content-sm-center " + styles.content}>
            		<div className={"col-sm-6 " + styles.form_canvas}>
                        <h2>Rekryilmoittautuminen</h2>
                        <br/>
                        <p>Täytä tietosi allaoleviin kenttiin. Tähdellä merkityt kentät ovat pakollisia. Haettaviin tehtäviin pitää 
                        täyttää vähintään ensisijainen hakutoive. Lisätietoja-kenttään voit täyttää omia taustojasi,
                        jotka tukevat hakutoiveitasi.</p>
                        <br/>
                        <form>

                        <div className={"row form-group align-items-center " + styles.fname}>
                            <div className={"col-sm-3"}>
                                <label htmlFor="fnameInput" className={styles.label}>Etunimi:<span className={styles.tahti}>*</span></label>
                            </div>
                            <div className={"col"}>
                                <input name="fname" id="fnameInput" className="form-control" type="text" onChange={this.props.handleChange} value={this.props.fname} placeholder="Etunimi"/>
                            </div>
                        </div>
                        <div className={"row form-group align-items-center " + styles.lname}>
                            <div className={"col-sm-3"}>
                                <label htmlFor="lnameInput" className={styles.label}>Sukunimi:<span className={styles.tahti}>*</span></label>
                            </div>
                            <div className={"col"}>
                                <input name="lname" id="lnameInput" className="form-control" type="text" onChange={this.props.handleChange} value={this.props.lname} placeholder="Sukunimi"/>
                            </div>
                        </div>
                        <div className={"row form-group align-items-center " + styles.email}>
                            <div className={"col-sm-3"}>
                                <label htmlFor="emailInput" className={styles.label}>Sähköposti:<span className={styles.tahti}>*</span></label>
                            </div>
                            <div className={"col"}>
                                <input name="email" id="emailInput" className="form-control" type="email" onChange={this.props.handleChange} value={this.props.email} placeholder="Sähköposti"/>
                            </div>
                        </div>
                        <div className={"row form-group align-items-center " + styles.pnumber}>
                            <div className={"col-sm-3"}>
                                <label htmlFor="pnumberInput" className={styles.label}>Puhelinnumero:<span className={styles.tahti}>*</span></label>
                            </div>
                            <div className={"col"}>
                                <input name="pnumber" id="pnumberInput" className="form-control" type="text" onChange={this.props.handleChange} value={this.props.pnumber} placeholder="Puhelinnumero"/>
                            </div>
                        </div>
                        <div className={"row form-group align-items-center " + styles.tehtavat}>
                            <div className={"col-sm-3"}>
                                <label htmlFor="tehtavatInput" className={styles.label}>Ensisijainen tehtävä:<span className={styles.tahti}>*</span></label>
                            </div>
                            <div className={"col"}>
                                <select name="tehtavat" id="tehtavatInput" className="form-control" onChange={this.props.handleChange} value={this.props.tehtavat}>
                                    <option></option>
                                    <option>Näyttelijät</option>
                                    <option>Tanssijat</option>
                                    <option>Bändi</option>
                                    <option>Lavastus</option>
                                    <option>Puvustus</option>
                                    <option>Maskeeraus</option>
                                    <option>Varainhankinta</option>
                                    <option>Markkinointi</option>
                                    <option>Kuvaus</option>
                                    <option>Grafiikka</option>
                                    <option>Huolto</option>
                                </select>
                            </div>
                        </div>
                        <div className={"row form-group align-items-center " + styles.tehtavat}>
                            <div className={"col-sm-3"}>
                                <label htmlFor="tehtavatInput" className={styles.label}>Ensimmäinen varatehtävä:</label>
                            </div>
                            <div className={"col"}>
                                <select name="tehtavat" id="tehtavatInput" className="form-control" onChange={this.props.handleChange} value={this.props.tehtavat}>
                                    <option></option>
                                    <option>Näyttelijät</option>
                                    <option>Tanssijat</option>
                                    <option>Bändi</option>
                                    <option>Lavastus</option>
                                    <option>Puvustus</option>
                                    <option>Maskeeraus</option>
                                    <option>Varainhankinta</option>
                                    <option>Markkinointi</option>
                                    <option>Kuvaus</option>
                                    <option>Grafiikka</option>
                                    <option>Huolto</option>
                                </select>
                            </div>
                        </div>
                        <div className={"row form-group align-items-center " + styles.tehtavat}>
                            <div className={"col-sm-3"}>
                                <label htmlFor="tehtavatInput" className={styles.label}>Toinen varatehtävä:</label>
                            </div>
                            <div className={"col"}>
                                <select name="tehtavat" id="tehtavatInput" className="form-control" onChange={this.props.handleChange} value={this.props.tehtavat}>
                                    <option></option>
                                    <option>Näyttelijät</option>
                                    <option>Tanssijat</option>
                                    <option>Bändi</option>
                                    <option>Lavastus</option>
                                    <option>Puvustus</option>
                                    <option>Maskeeraus</option>
                                    <option>Varainhankinta</option>
                                    <option>Markkinointi</option>
                                    <option>Kuvaus</option>
                                    <option>Grafiikka</option>
                                    <option>Huolto</option>
                                </select>
                            </div>
                        </div>
                        <div className={"row form-group align-items-center " + styles.jarjesto}>
                            <div className={"col-sm-3"}>
                                <label htmlFor="jarjestoInput" className={styles.label}>Järjestö:<span className={styles.tahti}>*</span></label>
                            </div>
                            <div className={"col"}>
                                <select name="jarjesto" id="jarjestoInput" className="form-control" onChange={this.props.handleChange} value={this.props.jarjesto}>
                                    <option></option>
                                    <option>Asteriski ry</option>
                                    <option>Delta ry</option>
                                    <option>Digit ry</option>
                                    <option>IVA ry</option>
                                    <option>Nucleus ry</option>
                                    <option>Pulterit ry</option>
                                    <option>Statistika ry</option>
                                    <option>Synapsi ry</option>
                                    <option>TYK ry</option>
                                </select>
                            </div>
                        </div>
                        <div className={"row form-group align-items-center " + styles.lisatiedot}>
                            <div className={"col-sm-3"}>
                                <label htmlFor="lisatiedotInput" className={styles.label}>Lisätietoja:</label>
                            </div>
                            <div className={"col"}>
                                <textarea name="lisatiedot" id="lisatiedotInput" className="form-control" onChange={this.props.handleChange} value={this.props.lisatiedot}></textarea>  
                            </div>
                        </div>
                        <div className={"row form-group align-items-center justify-content-sm-center " + styles.submit}>
                            <div className={"col-sm-3"}>
                                <button className="btn btn-default" type="submit">Lähetä hakemus</button>
                            </div>
                        </div>

                        </form>

            		</div>
            	</div>
            </div>
        )
    }
}

export default Rekry