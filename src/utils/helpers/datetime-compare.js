function dateCompare(depart, arrival) {
    const date1 = new Date(depart);
    const date2 = new Date(arrival);

    console.log('Departure:', date1);
    console.log('Arrival:', date2);

    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        throw new Error('Invalid date format provided');
    }

    return date1.getTime() < date2.getTime();
}

module.exports =   dateCompare ;

