import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import $ from 'jquery';
import jQuery from 'jquery';
import Axios from 'axios';
import withRouter from '../pages/withRouter';
window.$ = window.jQuery = require('jquery');

//console.log(langcontent);

/*const script = document.createElement("script");
    script.src = "/js/card-slider-min.js";
    script.async = true;
    document.body.appendChild(script);
    const cscript = document.createElement("script");
    cscript.src = "/js/expand.js";
    cscript.async = true;
    document.body.appendChild(cscript);*/


class Formtab extends React.Component {
    constructor(props) {
        super(props);
        //this.getID = sessionStorage.getItem('pageid');
        //this.Lang = sessionStorage.getItem('lang');
        //alert(this.Lang);
        //this.storageChanged = this.storageChanged.bind(this);

    }
    state = {
        accno: '',
    }
    accnochange = event => { this.setState({ accno: event.target.value }) }




    onSubmit = e => {
        e.preventDefault();

        if (this.state.accno == "") {
            //console.log(this.state.accno)
            //isError.accno ="please enter the firstname";
            //isValid = false;
            //alert(this.state.accno);
            this.setState({
                errormsg: "please enter 16 digit account number",
                succmessage: null
            });
        } else {


            //const getLang = sessionStorage.getItem('lang');		
            //alert(this.state.accno);

            /*this.setState({
            errormsg: null,
            succmessage: this.state.accno
            }); */
        }
    };

    componentDidMount() {

        //var lng = sessionStorage.getItem('lang');


        function generateIBAN(customerAccount, branch) {
            try {
                /* global BigInt */
                // Initialization and input logging
                // Note: You'll need to implement the pr_init and pr_debug functions in JavaScript.
                pr_init(branch, 'SUMANTH1');
                pr_debug('AC', 'Input values ...');
                pr_debug('AC', 'l_country_code = OM');
                pr_debug('AC', 'l_dummy_chk_digits = 00');
                pr_debug('AC', 'l_bank_code = 041');
                pr_debug('AC', 'l_cust_ac_no = ' + customerAccount);

                // Constants
                const countryCode = 'OM';
                const bankCode = '041';
                let custAccountNo = customerAccount.padStart(16, '0');
                const dummyCheckDigits = '00';
                const divisor = BigInt(97);
                const mainNumber = BigInt(98);

                // IBAN construction
                let tmpStr1 = countryCode + dummyCheckDigits + bankCode + custAccountNo;
                pr_debug('AC', 'l_tmp_str1 = ' + tmpStr1);

                let tmpStr = bankCode + custAccountNo + countryCode + dummyCheckDigits;
                pr_debug('AC', 'l_tmp_str = ' + tmpStr);

                let len = tmpStr.length;
                pr_debug('AC', 'l_len = ' + len);

                // Convert to numeric string
                let numOnlyStr = '';
                for (let idx = 0; idx < len; idx++) {
                    let char = tmpStr[idx];
                    let ascii = char.charCodeAt(0);
                    let dig;

                    if (ascii >= 48 && ascii <= 57) { // 0-9
                        dig = char;
                    } else {
                        dig = ascii - 55;
                    }

                    pr_debug('AC', 'l_dig = ' + dig);
                    numOnlyStr += dig;
                }
                pr_debug('AC', 'l_numonly_str = ' + numOnlyStr);

                // Calculate check digit
                let tmpNumber = BigInt(numOnlyStr);
                let modReminder = tmpNumber % divisor;
                let checkDigit = mainNumber - modReminder;

                pr_debug('AC', 'l_tmpNumber = ' + tmpNumber);
                pr_debug('AC', 'l_modReminder = ' + modReminder);
                pr_debug('AC', 'l_chk_digit = ' + checkDigit);

                if (checkDigit < 10) {
                    checkDigit = `0${checkDigit}`;
                    pr_debug('AC', 'l_chk_digit_fixed = ' + checkDigit);
                }

                // Construct IBAN with check digit
                let newAcNoWithChkDig = countryCode + checkDigit + bankCode + custAccountNo;
                pr_debug('AC', 'CASA number with check digits = ' + newAcNoWithChkDig);

                return newAcNoWithChkDig;
            } catch (error) {
                // Error handling
                pr_debug('AC', 'Error: ' + error.message);
            }
        }

        // Debug functions (you'll need to implement these or replace them with console.log)
        function pr_init(branch, code) {
            // Initialization code here
        }

        function pr_debug(tag, message) {
            // Logging code here
            console.log(tag + ': ' + message);
        }
        setTimeout(
            function () {
                $('#subbtn').click(function () {
                    var accv = $("#accno").val();
                    if (accv != "") {
                        if (accv.length == 16 && /^[0-9]+$/.test(accv)) {
                            var ff = generateIBAN(accv, 'OM');
                            //alert(ff);
                            $(".merr").hide();
                            $("#ibanres").html('<p class="alert alert-success">IBAN: ' + ff + '</p>');
                        } else {
                            $(".merr").hide();
                            $("#ibanres").html('<p class="alert alert-danger">Please enter 16 digit account number</p>');
                        }
                    } else {
                        $(".alert-danger").show();
                        $("#ibanres").html('');
                    }
                });
            }
                .bind(this),
            1000
        );


    }
    render() {
        //console.log(this.props);
        const { isError } = this.state;

        //console.log(apprcs);

        //console.log(hash);
        var pth = 'https://alizzapi.alizzislamic.om/';
        return (
            <>
                <div id="readspeaker_button1" className="rs_skip rsbtn rs_preserve mt-3 container">
                    <a rel="nofollow" className="rsbtn_play" title="Listen to this page using ReadSpeaker" href="https://app-eu.readspeaker.com/cgi-bin/rsent?customerid=14430&amp;lang=en_us&amp;voice=Mark&&amp;readclass=audcnt&amp;url=https://alizzislamic.om/">
                        <span className="rsbtn_left rsimg rspart"><span className="rsbtn_text"><span>Listen</span></span></span>
                        <span className="rsbtn_right rsimg rsplay rspart"></span>
                    </a>
                </div>

                <div className="audcnt">
                    <div className="container"><div className="row"><div className="col-md-12 bnrcntbox hnm"><h3>International Bank Account Number (IBAN)</h3></div></div></div>
                    <section className="calc-inner" id="formdv">
                        <div className="container pb-5">
                            <div className="row  d-flex justify-content-center">
                                {(() => {
                                    var ind = this.onSubmit;
                                    var err = this.state.errormsg;
                                    var fnm = this.accnochange;
                                    var err = this.state.errormsg;
                                    var succ = this.state.succmessage;
                                    return (

                                        <><div className="col-md-12">
                                            <div>
                                                <p style={{ marginTop: '1.6em' }}>The International Bank Account Number (IBAN) is the international standard for identifying international bank accounts across national borders.</p>
                                                <p>The IBAN is comprised of alphanumeric characters of different lengths, for example 23 in Oman and in the UAE, 24 in Saudi Arabia, 27 within Europe (German IBAN: 22 characters).</p>
                                                <p>The Alizz Islamic Bank IBAN Generator will help you find your international bank account number to facilitate remittances locally and globally</p>
                                                <p>Please enter your Alizz Islamic Bank account number to generate your IBAN Number</p>
                                            </div>




                                            <div className="col-md-5" style={{ margin: 'auto' }}>
                                                {(() => {
                                                    if (err != null) {
                                                        return (
                                                            <><div className="alert alert-danger merr">{err}</div></>
                                                        );
                                                    }
                                                })()}
                                                {(() => {
                                                    if (succ != null) {
                                                        return (
                                                            <><div className="alert alert-success">{succ}</div></>
                                                        );
                                                    }
                                                })()}
                                                <div id={`ibanres`}></div>
                                                <form onSubmit={ind} className="finfrm">

                                                    <div className="mb-3 mt-3 form-group">
                                                        <label htmlFor={`accno`}>Account Number</label>
                                                        <input type="text" className="form-control" id={`accno`} placeholder="" name={`accno`} onChange={fnm} maxlength="16" minlength="16" />

                                                    </div>

                                                    <button type="submit" className="btn btn-primary sty1 mx-2" id={`subbtn`}>Generate IBAN</button>
                                                    <br />
                                                </form>
                                            </div>

                                            <div>
                                                <p><strong>Disclaimer</strong></p>
                                                <p>*The IBAN generator tool indicates the IBAN number that will match the number entered in the Account Number field. The validity of the account number is not checked. Please ensure that you enter your account number correctly.</p>
                                            </div>
                                            <div>
                                                <h3>Sultanate of Oman's IBAN Standard</h3>
                                                <img src="https://alizzapi.alizzislamic.om/uploads/iban_standard_6f4953208b.png" style={{ width: '500px' }} />

                                                <h3>Benefits of IBAN</h3>
                                                <div className="tnpnlinr mt-3">
                                                    <div className="card">
                                                        <div className="ex_title active_ex">Simplify Transactions</div>
                                                        <div className="ex_cnt" style={{ display: 'block' }}>
                                                            <p>IBAN eliminates the need for complex account numbers and bank codes. This improves transparency and reduces the risk of errors.</p>
                                                        </div>
                                                    </div>
                                                    <div className="card">
                                                        <div className="ex_title">Increase Transparency</div>
                                                        <div className="ex_cnt">
                                                            <p>IBAN provides clear identification of financial institutions, promoting greater transparency within the financial system.</p>
                                                        </div>
                                                    </div><div className="card">
                                                        <div className="ex_title">Enhance Efficiency</div>
                                                        <div className="ex_cnt">
                                                            <p>IBAN streamlines domestic and international payments, saving businesses and individuals time and faster processing.</p>
                                                        </div>
                                                    </div><div className="card">
                                                        <div className="ex_title">Global Recognition</div>
                                                        <div className="ex_cnt">
                                                            <p>IBAN is recognized and used in over 80 countries, making it a trusted and reliable standard for international transactions. This strengthens Oman's position in the global financial market.</p>
                                                        </div>
                                                    </div><div className="card">
                                                        <div className="ex_title">Modernize Financial System</div>
                                                        <div className="ex_cnt">
                                                            <p>Significant step forward in modernizing Oman's financial infrastructure enabling seamless local and international payments</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div></>
                                    );
                                })()}



                            </div>
                        </div>
                    </section>
                </div>

            </>

        );
    }
}


//export default Formtab;
export default withRouter(Formtab);

