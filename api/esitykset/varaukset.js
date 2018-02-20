const Varaus = require('../../schema/varaus-model');
const Esitys = require('../../schema/esitys-model');
const mailer = require('../../utils/mailer');

module.exports = {
    getAll: (req, res) => {
        Varaus.find({esitysId: req.params._id})
        .then(_data => {
            res.json({success: true, data: _data})
        })
        .catch(err => {
            res.json({success: false, data: err})
        })
    },

    createNewPublic: (req, res) => {
        
    },

    createNewAdmin: (req, res) => {
        let booking = req.body;
        validateAdmin(booking)
        .then(() => {
            tryIfSpace(booking)
        })
        .then(() => {
            const bookingObj = new Varaus({
                fname: booking.fname,
                sname: booking.sname,
                email: booking.email,
                pnumber: booking.pnumber,
                scount: booking.scount || 0,
                ncount: booking.ncount || 0,
                ocount: booking.ocount || 0,
                oprice: booking.oprice || 0,
                paymentMethod: booking.paymentMethod,
                paid: booking.paid,
                esitysId: booking.esitysId,
                additional: booking.additional,
                bookingId: generateId()
            })
            bookingObj.save()
        })
        .then(_booking => {
            res.json({success: true, data: _booking});
        })
        .catch(err => {
            if(err.code) {
                res.status(err.code).send(err.message);
            } else 
                console.log(err);
        })
       
    },

    update: (req, res) => {

    },

    remove: (req, res) => {

    },

    sendTestMail: (req, res) => {
        let booking = {email: 'pymapa@utu.fi'}
        mailer.sendTicket(booking);
        res.status(200).send();
    }
}

function validateAdmin(booking) {
    let promise = new Promise((resolve, reject) => {
        console.log('validation')
        resolve();
    })
    return promise;
}

function validate(booking) {
    let promise = new Promise((resolve, reject) => {
        if(isEmptyField(booking.fname) || isEmptyField(booking.sname) || isEmptyField(booking.email)) {
            reject({code: 400, message: 'Täytä kaikki puuttuvat kentät'})
        } else if (!validateEmail(booking.email)) {
            reject({code: 400, message: 'Virheellinen sähköposti'})
        } else if (isEmptyField(booking.esitysId)) {
            reject({code: 400, message: 'Valitse esitys'})
        } else if (booking.scount + booking.ncount + booking.ocount == 0) {
            reject({code: 400, message: 'Varauksessa oltava vähintään yksi lippu'})
        } else {
            resolve();
        }
    })
    return promise;
}

function validateEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function isEmptyField(field) {
    return !field || field === "";
}

function generateId() {
    let id = '';
    const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    for (var i = 0; i < 5; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}

function tryIfSpace(booking) {
    return new Promise((resolve, reject) => {
        let totalCountInShow = 0;
        Varaus.find({bookingId: booking.bookingId})
        .then(data => {
            data.map(b => { totalCountInShow =+ getTotalCount(b) })
            if(totalCountInShow + getTotalCount(booking) > 130) {
                reject({code: 400, message: 'Esityksessä ei ole tarpeeksi paikkoja jäljellä'});
            } else {
                resolve(booking);
            }
        }) 
    })
}

function getTotalCount(booking) {
    return booking.ncount + booking.scount + booking.ocount;
}