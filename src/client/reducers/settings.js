import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';
import * as strings from '../lib/strings';
import user from '../lib/user';

const loading = (state = false, action) => {
    switch (action.type) {
        case types.SettingsStartLoading:
            return true;
        case types.SettingsUsageLoadSucceed:
            return false;
        case types.SettingsUsageLoadFailed:
            return false;
        case types.SettingsPaymentsLoadSucceed:
            return false;
        case types.SettingsPaymentsLoadFailed:
            return false;
        default:
            return state;
    }
};

const usageMonthlyData = (state = [], action) => {

    if (action.type == types.SettingsUsageLoadSucceed &&
        action.firstLoad) {

        // transform data
        const data = [];
        const totalCountData = {};

        action.data.monthlyData.map((row) => {

            if (!totalCountData[row.dateIdentifier])
                totalCountData[row.dateIdentifier] = 0;

            totalCountData[row.dateIdentifier] += row.count;

        });

        Object.keys(totalCountData).map((dataIdentifier) => {

            const count = totalCountData[dataIdentifier];
            let dateLabel = "";

            const splitAry = dataIdentifier.split("-");

            if (splitAry.length > 1) {

                const year = splitAry[0];
                let month = splitAry[1];
                if (month.substr(0, 1) == '0')
                    month = month.substr(1, 1)

                dateLabel = strings.MonthNames[user.lang][month - 1] + " " + year;
            }

            data.push({
                monthIdentifier: dataIdentifier,
                dateLabel,
                count: count
            });

        });

        return data;

    }

    return state;

};

const usageDailyData = (state = [], action) => {

    if (action.type == types.SettingsUsageLoadSucceed) {

        const data = {}; // free: paid:

        action.data.dailyData.map((row) => {

            if (!data[row.paymentType])
                data[row.paymentType] = {};

            data[row.paymentType][row.dateIdentifier] = row.count;

        });

        return data;

    }

    return state;

};

const usageGraphMonth = (state = "", action) => {
    switch (action.type) {
        case types.SettingsUsageChangeMonth:
            return action.month;
        default:
            return state;
    }
};

const payments = (state = [], action) => {
    switch (action.type) {
        case types.SettingsPaymentsLoadSucceed:
            return action.data;
        default:
            return state;
    }
};

export default combineReducers({
    loading,
    usageMonthlyData,
    usageDailyData,
    usageGraphMonth,
    payments
});;
