import React, { Component } from 'react';

import Esitysvalinta from './Esitysvalinta';
import VarausLista from './VarausLista';
import UusiVaraus from './UusiVaraus';
import Sahkopostit from '../../Shared/Sahkopostit';

import ajax from '../../../Utils/Ajax';
import Messages from '../../../Utils/Messages';
/* import PropTypes from "" */

const MESSAGE_SUCCESS = 'success';
const MESSAGE_WARNING = 'warning';
const MESSAGE_ERROR = 'error';

class Varaustenhallinta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      esitykset: [],
      varaukset: [],
      filteredVaraukset: [],
      valittuEsitys: {},
      valittuVarausId: '',
      naytaSahkopostit: false,
      fname: '',
      sname: '',
      email: '',
      pnumber: '',
      ncount: 0,
      scount: 0,
      ocount: 0,
      nprice: 16,
      sprice: 14,
      oprice: 12,
      price: '',
      lisatiedot: '',
      paid: 'true',
      checked: 'false',
      paymentMethod: '0',
      sendemail: 'true',
      ilmottu: false,
      messages: [],
      warnings: [],
      errors: [],
      searchword: '',
    };

    this.valitseEsitys = this.valitseEsitys.bind(this);
    this.haeVaraukset = this.haeVaraukset.bind(this);
    this.haeKaikkiVaraukset = this.haeKaikkiVaraukset.bind(this);
    this.filterVaraukset = this.filterVaraukset.bind(this);
    this.haeEsitykset = this.haeEsitykset.bind(this);
    this.toggleSahkopostit = this.toggleSahkopostit.bind(this);
    this.toggleMuokkaaVaraustaModal = this.toggleMuokkaaVaraustaModal.bind(this);
    this.toggleUusiVarausModal = this.toggleUusiVarausModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.removeBooking = this.removeBooking.bind(this);
    this.redeemBooking = this.redeemBooking.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.emptyFields = this.emptyFields.bind(this);
    this.countPrice = this.countPrice.bind(this);
    this.sendConfirmationEmail = this.sendConfirmationEmail.bind(this);
  }

  componentDidMount() {
    ajax
      .sendGet('/getShowsWithCounts')
      .then((_data) => {
        this.setState({ esitykset: _data.data });
        this.setState({ valittuEsitys: _data.data[0] });
        this.haeVaraukset(_data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });

    /* ajax.sendGet('/price')
        .then(_data =>{
        this.setState({priceS: _data.data[0].value})
        this.setState({priceN: _data.data[1].value});
        })
        .catch(err => {
        console.log(err);
        }) */
  }

  toggleSahkopostit() {
    this.setState({ naytaSahkopostit: !this.state.naytaSahkopostit });
  }

  toggleMuokkaaVaraustaModal(varaus) {
    $('#muokkaaVaraustaModal').modal('show');
    this.state.esitykset.map((esitys) => {
      if (esitys._id === varaus.esitysId) {
        this.setState({ valittuEsitys: esitys });
      }
    });
    this.setState(
      {
        valittuVarausId: varaus._id,
        fname: varaus.fname,
        sname: varaus.sname,
        email: varaus.email,
        pnumber: varaus.pnumber,
        ncount: varaus.ncount,
        scount: varaus.scount,
        ocount: varaus.ocount,
        oprice: varaus.oprice,
        lisatiedot: varaus.additional,
        paid: varaus.paid.toString(),
        checked: varaus.checked.toString(),
        paymentMethod: varaus.paymentMethod.toString(),
        sendemail: 'false',
        ilmottu: false,
        messages: [],
        warnings: [],
        errors: [],
      },
      () => {
        this.countPrice();
      },
    );
  }

  toggleUusiVarausModal() {
    $('#uusiVarausModal').modal('show');
    this.emptyFields();
  }

  handleChange(e) {
    const value = e.target.value;

    if (
      e.target.name === 'ncount' ||
      e.target.name === 'scount' ||
      e.target.name === 'ocount' ||
      e.target.name === 'oprice'
    ) {
      this.setState({ [e.target.name]: value }, () => {
        this.countPrice();
      });
    } else if (e.target.name === 'esitys') {
      this.state.esitykset.map((esitys) => {
        if (e.target.value === esitys._id) {
          this.valitseEsitys(esitys);
        }
      });
    } else if (e.target.name === 'searchword') {
      this.setState({ [e.target.name]: value.toLowerCase() }, () => {
        this.filterVaraukset();
      });
    } else {
      this.setState({ [e.target.name]: value });
    }
  }

  countPrice() {
    const sum =
      this.state.ncount * this.state.nprice +
      this.state.scount * this.state.sprice +
      this.state.ocount * this.state.oprice;
    this.setState({ price: sum });
  }

  filterVaraukset() {
    const result = this.state.varaukset.filter(varaus =>
      varaus.fname.toLowerCase().includes(this.state.searchword) ||
        varaus.sname.toLowerCase().includes(this.state.searchword) ||
        varaus.email.toLowerCase().includes(this.state.searchword) ||
        varaus.bookingId.toLowerCase().includes(this.state.searchword));
    this.setState({ filteredVaraukset: result });
  }

  sendConfirmationEmail() {
    if (confirm('Haluatko varmasti lähettää varausvahvistussähköpostin?')) {
      ajax
        .sendGet('/admin/varaus/sendConfirmationMail/' + this.state.valittuVarausId)
        .then((res) => {
          if (res.success) {
            this.addMessage(MESSAGE_SUCCESS, res.data);
          } else {
            this.addMessage(MESSAGE_ERROR, res.data);
          }
        })
        .catch((err) => {
          this.addMessage(MESSAGE_ERROR, err.data);
        });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ ilmottu: true });
    const url = '/admin/varaus';
    ajax
      .sendPost(url, {
        fname: this.state.fname,
        sname: this.state.sname,
        email: this.state.email,
        pnumber: this.state.pnumber,
        scount: this.state.scount,
        ncount: this.state.ncount,
        ocount: this.state.ocount,
        oprice: this.state.oprice,
        paymentMethod: this.state.paymentMethod,
        paid: this.state.paid,
        checked: this.state.checked,
        sendemail: this.state.sendemail,
        esitysId: this.state.valittuEsitys._id,
        additional: this.state.lisatiedot,
      })
      .then((data) => {
        if (data.success) {
          this.addMessage(MESSAGE_SUCCESS, 'Ilmoittautuminen onnistui!');
          this.haeVaraukset(this.state.valittuEsitys);
          this.haeEsitykset();
        } else {
          this.setState({ ilmottu: false });
          this.addMessage(MESSAGE_WARNING, data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ ilmottu: false });
        this.addMessage(
          MESSAGE_ERROR,
          'Virhe!',
          'Palvelimella tapahtui virhe. Yritä myöhemmin uudelleen tai ota yhteys webmastereihin.',
        );
      });
  }

  handleUpdate(e) {
    e.preventDefault();
    this.setState({ ilmottu: true });
    const url = '/admin/varaus/' + this.state.valittuVarausId;
    ajax
      .sendPut(url, {
        _id: this.state.valittuVarausId,
        fname: this.state.fname,
        sname: this.state.sname,
        email: this.state.email,
        pnumber: this.state.pnumber,
        scount: this.state.scount,
        ncount: this.state.ncount,
        ocount: this.state.ocount,
        oprice: this.state.oprice,
        paymentMethod: this.state.paymentMethod,
        paid: this.state.paid,
        checked: this.state.checked,
        esitysId: this.state.valittuEsitys._id,
        additional: this.state.lisatiedot,
      })
      .then((data) => {
        if (data.success) {
          this.addMessage(MESSAGE_SUCCESS, 'Tietojen päivitys onnistui!');
          this.haeVaraukset(this.state.valittuEsitys);
          this.haeEsitykset();
        } else {
          this.setState({ ilmottu: false });
          this.addMessage(MESSAGE_WARNING, data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ ilmottu: false });
        this.addMessage(
          MESSAGE_ERROR,
          'Virhe!',
          'Palvelimella tapahtui virhe. Yritä myöhemmin uudelleen tai ota yhteys webmastereihin.',
        );
      });
  }

  emptyFields() {
    this.setState({
      bookingId: '',
      fname: '',
      sname: '',
      email: '',
      pnumber: '',
      ncount: '',
      scount: '',
      ocount: '',
      oprice: 12,
      price: '',
      lisatiedot: '',
      messages: [],
      warnings: [],
      errors: [],
      ilmottu: false,
      paid: 'true',
      checked: 'false',
      paymentMethod: '0',
      sendemail: 'true',
    });
  }

  removeBooking(varausId) {
    if (confirm('Haluatko varmasti poistaa varauksen?')) {
      ajax
        .sendDelete('/admin/varaus/' + varausId)
        .then((data) => {
          if (data.success) {
            alert(data.data);
            this.haeVaraukset(this.state.valittuEsitys);
            this.haeEsitykset();
          } else {
            alert(data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  redeemBooking(varausId) {
    if (confirm('Haluatko varmasti merkitä varauksen noudetuksi?')) {
      const url = '/admin/redeem/' + varausId;
      ajax
        .sendPut(url, {
          _id: varausId,
          checked: true,
        })
        .then((data) => {
          if (data.success) {
            this.haeVaraukset(this.state.valittuEsitys);
          } else {
            alert('Varausta ei voitu merkitä noudetuksi.');
          }
        })
        .catch((err) => {
          console.log(err);
          alert('Palvelimella tapahtui virhe, jonka vuoksi varausta ei voitu merkitä noudetuksi.');
        });
    }
  }

  valitseEsitys(t) {
    this.setState({ valittuEsitys: t });
    this.haeVaraukset(t);
    this.filterVaraukset(t);
  }

  haeEsitykset() {
    ajax
      .sendGet('/getShowsWithCounts')
      .then((_data) => {
        this.setState({ esitykset: _data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  haeVaraukset(esitys) {
    ajax
      .sendGet('/admin/varaukset/' + esitys._id)
      .then((_data) => {
        this.setState({ varaukset: _data.data }, () => {
          this.filterVaraukset();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  haeKaikkiVaraukset() {
    ajax
      .sendGet('/admin/kaikkivaraukset/')
      .then((_data) => {
        this.setState(
          {
            varaukset: _data.data,
            valittuEsitys: { name: 'Kaikki varaukset' },
          },
          () => {
            this.filterVaraukset();
          },
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Add different kinds of error or warning messages
  addMessage(type, newHeader, newText) {
    this.setState({
      messages: [],
      warnings: [],
      errors: [],
    });
    if (type === MESSAGE_WARNING) {
      const newWarnings = this.state.warnings;
      newWarnings.push({ header: newHeader, text: newText });
      this.setState({ warnings: newWarnings });
    } else if (type === MESSAGE_ERROR) {
      const newErrors = this.state.errors;
      newErrors.push({ header: newHeader, text: newText });
      this.setState({ errors: newErrors });
    } else if (type === MESSAGE_SUCCESS) {
      const newMessages = this.state.messages;
      newMessages.push({ header: newHeader, text: newText });
      this.setState({ messages: newMessages });
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row justify-content-between align-items-center">
          <div className="col">
            <h1>Varaustenhallinta</h1>
          </div>
          <div className="col d-flex justify-content-end">
            <button className="btn btn-default" onClick={() => this.toggleUusiVarausModal()}>
              Lisää uusi varaus
            </button>
          </div>
        </div>
        <UusiVaraus
          emptyFields={this.emptyFields}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          sendConfirmationEmail={this.sendConfirmationEmail}
          fname={this.state.fname}
          sname={this.state.sname}
          email={this.state.email}
          pnumber={this.state.pnumber}
          scount={this.state.scount}
          ncount={this.state.ncount}
          ocount={this.state.ocount}
          oprice={this.state.oprice}
          price={this.state.price}
          lisatiedot={this.state.lisatiedot}
          ilmottu={this.state.ilmottu}
          valittuEsitys={this.state.valittuEsitys}
          esitykset={this.state.esitykset}
          paymentMethod={this.state.paymentMethod}
          paid={this.state.paid}
          checked={this.state.checked}
          sendemail={this.state.sendemail}
          messages={
            <Messages
              messages={this.state.messages}
              warnings={this.state.warnings}
              errors={this.state.errors}
            />
          }
        />

        <div className="row">
          <div className="col-sm-4">
            <h3>Valitse esitys</h3>

            <Esitysvalinta
              esitykset={this.state.esitykset}
              valitseEsitys={this.valitseEsitys}
              haeKaikkiVaraukset={this.haeKaikkiVaraukset}
            />

            {this.state.naytaSahkopostit ? (
              <Sahkopostit
                jasenet={this.state.varaukset}
                toggleSahkopostit={this.toggleSahkopostit}
              />
            ) : (
              <button className="btn btn-default" onClick={this.toggleSahkopostit}>
                Näytä sähköpostit
              </button>
            )}
          </div>
          <div className="col">
            <div className="row justify-content-between align-items-center">
              <div className="col-8">
                <h3>{this.state.valittuEsitys.name}</h3>
              </div>
              <div className="col-4 d-flex justify-content-end">
                <input
                  name="searchword"
                  id="searchword"
                  className="form-control"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.searchword}
                  placeholder="Hakusana"
                />
              </div>
            </div>
            <VarausLista
              removeBooking={this.removeBooking}
              redeemBooking={this.redeemBooking}
              varaukset={this.state.filteredVaraukset}
              emptyFields={this.emptyFields}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              handleUpdate={this.handleUpdate}
              sendConfirmationEmail={this.sendConfirmationEmail}
              toggleMuokkaaVaraustaModal={this.toggleMuokkaaVaraustaModal}
              fname={this.state.fname}
              sname={this.state.sname}
              email={this.state.email}
              pnumber={this.state.pnumber}
              scount={this.state.scount}
              ncount={this.state.ncount}
              ocount={this.state.ocount}
              oprice={this.state.oprice}
              price={this.state.price}
              lisatiedot={this.state.lisatiedot}
              ilmottu={this.state.ilmottu}
              valittuEsitys={this.state.valittuEsitys}
              valittuVarausId={this.state.valittuVarausId}
              esitykset={this.state.esitykset}
              paymentMethod={this.state.paymentMethod}
              paid={this.state.paid}
              checked={this.state.checked}
              sendemail={this.state.sendemail}
              messages={
                <Messages
                  messages={this.state.messages}
                  warnings={this.state.warnings}
                  errors={this.state.errors}
                />
              }
            />
          </div>
        </div>
      </div>
    );
  }
}
/* Varaustenhallinta.propTypes = {
} */

export default Varaustenhallinta;
