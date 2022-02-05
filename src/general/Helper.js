export const toEnglishDigits = (val) => {
    const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const english = val.replace(/[۰-۹]/g, (char) => persian.indexOf(char));

    return english;
};

export const getNumeric = (val) => toEnglishDigits(val).replace(/\D/g, '');

export const isNationalCode = (input) => {
    var L = input.length;

    if (L < 8 || parseInt(input, 10) == 0) return false;
    input = ('0000' + input).substr(L + 4 - 10);
    if (parseInt(input.substr(3, 6), 10) == 0) return false;
    var c = parseInt(input.substr(9, 1), 10);
    var s = 0;
    for (var i = 0; i < 9; i++)
        s += parseInt(input.substr(i, 1), 10) * (10 - i);
    s = s % 11;
    return (s < 2 && c == s) || (s >= 2 && c == 11 - s);
    return true;
};

export const isPersonnelCode = (input) => {
    if (isNaN(input)) {
        return false;
    }

    if (!input.toString().startsWith('07')) {
        return false;
    }

    return true;
};

export const isMobile = (input) => {
    if (isNaN(input)) {
        return false;
    }

    if (input.length !== 11) {
        return false;
    }

    if (!input.toString().startsWith('09')) {
        return false;
    }

    return true;
};

export const getUriAndMessageType = (name) => {
    let uri, messageType;
    if (name === 'message') {
        uri = 'messaging';
        messageType = 'اطلاعیه';
    } else if (name === 'rule') {
        uri = 'rule';
        messageType = 'قانون';
    }
    return {
        uri,
        messageType,
    };
};

export const getDateFromObject = (date) => {
    let { year, month, day } = date;
    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');

    return year + '/' + month + '/' + day;
};

export const getWelfareName = (welfareId) => {
    switch (welfareId) {
        case 1:
            return 'باشگاه';
        case 2:
            return 'اتاق جلسات';
        case 3:
            return 'کارواش';
        case 4:
            return 'کافه';
        default:
            return 'عمومی';
    }
};

export const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
