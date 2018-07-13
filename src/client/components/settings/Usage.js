import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';
import { Bar } from 'react-chartjs-2';

import * as actions from '../../actions';
import * as constant from '../../lib/const';
import * as strings from '../../lib/strings';
import * as util from '../../lib/utils';
import * as config from '../../lib/config';
import user from '../../lib/user';

class Usage extends Component {

    state = {
    }

    static propTypes = {
    }

    onMonthChange = (month) => {

        this.props.load(month, false);

    }

    componentDidMount = () => {

        // get this month
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        if (month < 10)
            month = "0" + month;

        this.props.load(year + "-" + month, true);

    }

    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    render() {

        const graphMonth = this.props.graphMonth;
        const origData = this.props.dailyData;
        const monthAry = graphMonth.split("-");

        let data = {};

        if (monthAry.length > 1) {
            const year = monthAry[0];
            let month = monthAry[1];
            if (month.substr(0, 1) == 0) {
                month = month.substr(1, 1);
            }

            const daysInMonth = this.daysInMonth(month, year);

            data.labels = [];

            const freeCounts = [];
            const paidCounts = [];

            for (let i = 1; i <= daysInMonth; i++) {

                data.labels.push(i);

                let labelday = i;
                if (labelday < 10)
                    labelday = "0" + labelday;

                const dateIdentifier = graphMonth + "-" + labelday;

                if (origData[constant.UsageTypeFree] &&
                    origData[constant.UsageTypeFree][dateIdentifier]) {

                    freeCounts.push(origData[constant.UsageTypeFree][dateIdentifier]);

                } else {

                    freeCounts.push(0);

                }

                if (origData[constant.UsageTypePaid] &&
                    origData[constant.UsageTypePaid][dateIdentifier]) {

                    paidCounts.push(origData[constant.UsageTypePaid][dateIdentifier]);

                } else {

                    paidCounts.push(0);

                }

            }

            data.datasets = [
                {
                    label: "Team Message",
                    backgroundColor: "#ff6384",
                    borderColor: "#ff6384",
                    hoverBackgroundColor: "#FF99AB",
                    hoverBorderColor: "#FF99AB",
                    data: freeCounts,
                    stack: 2
                },
                {
                    label: "Customer Message",
                    backgroundColor: "#36a2eb",
                    borderColor: "#36a2eb",
                    hoverBackgroundColor: "#7FCCFF",
                    hoverBorderColor: "#7FCCFF",
                    data: paidCounts,
                    stack: 2
                }
            ]


        } else {

            // show sample data
            data = {
                labels: [
                    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
                    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
                ],
                datasets: [
                    {
                        label: "Team Message",
                        backgroundColor: "#ff6384",
                        borderColor: "#ff6384",
                        hoverBackgroundColor: "#FF99AB",
                        hoverBorderColor: "#FF99AB",
                        data: [
                            231, 123, 434, 534, 1234, 123, 250, 29, 203, 124,
                            231, 123, 434, 534, 1234, 123, 250, 29, 203, 124,
                            231, 123, 434, 534, 1234, 123, 250, 29, 203, 124,
                        ],
                        stack: 2
                    },
                    {
                        label: "Customer Message",
                        backgroundColor: "#36a2eb",
                        borderColor: "#36a2eb",
                        hoverBackgroundColor: "#7FCCFF",
                        hoverBorderColor: "#7FCCFF",
                        data: [
                            231, 123, 434, 534, 1234, 123, 250, 29, 203, 124,
                            231, 123, 434, 534, 1234, 123, 250, 29, 203, 124,
                            231, 123, 434, 534, 1234, 123, 250, 29, 203, 124,
                        ],
                        stack: 2
                    }
                ]
            };
        }


        return (

            <div className="col-12 pt-15" >

                <div className={classNames("card selector")}>

                    <div className="card-body">

                        <select
                            className="form-control"
                            onChange={(e) => this.onMonthChange(e.target.value)}
                            value={this.props.graphMonth}>

                            {this.props.monthlyData.map((monthlyData) => {

                                let label = monthlyData.dateLabel + " ( " + monthlyData.count + " Total )";
                                return <option
                                    value={monthlyData.monthIdentifier}
                                    key={monthlyData.monthIdentifier}
                                >{label}</option>

                            })}

                        </select>

                    </div>

                </div>

                <div className="card chart">

                    <div className="card-body">

                        <Bar
                            data={data}
                        />

                    </div>

                </div>

            </div >

        );
    }

}

const mapStateToProps = (state) => {
    return {
        monthlyData: state.settings.usageMonthlyData,
        dailyData: state.settings.usageDailyData,
        graphMonth: state.settings.usageGraphMonth
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        load: (month, first) => dispatch(actions.settings.loadUsage(month, first)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Usage);
