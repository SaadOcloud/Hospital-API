
const currencyConversion = {
    USD: 1.03, 
    EUR: 0.97, 
    BITCOIN: 0.000023,
}

const getFee = (appointments, requiredCurrency) => {

    const fee = {}
    fee.unpaid = appointments.reduce((acc, appointment) => {
        if(!appointment.isPaid) {
            if(appointment.currency !== requiredCurrency) {
                acc =  acc + (appointment.fee * currencyConversion[appointment.currency])
            } else {
                acc = acc + appointment.fee
            }
        }
        return acc
    }, 0)
    fee.paid = appointments.reduce((acc, appointment) => {
        if(appointment.isPaid) {
            if(appointment.currency !== requiredCurrency) {
                acc =  acc + (appointment.fee * currencyConversion[appointment.currency])
            } else {
                acc = acc + appointment.fee
            }
        }
        return acc
    }, 0)

    return fee
}

module.exports=getFee