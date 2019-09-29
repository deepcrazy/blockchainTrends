(function (window, document) {

    localStorage.clear();                                                                       //  Clearing the local storage whenever webpage loads.
    var cryptocurrencyTrends = JSON.parse(localStorage.getItem("cryptocurrencyTrends")) || {};  //  Setting the variable as empty object if no inputs are given for cryptocurrency voting
    makeCryptocurrencyTrendsChart();                                                            //  Calling function to create the chart with no data if cryptocurrencyTrends var is an empty Object.
    document.getElementById("submitDetails").disabled = true;                                   //  Cryptocurrency Voting Form submit button disabled as there is no data on loading the page.

    // Getting the div references of the html 
    var layout = document.getElementById('layout'),
        menu = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink'),
        content = document.getElementById('main');

    //  Adding CSS class to the elements which are currently in active state.
    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for (; i < length; i++) {
            if (classes[i] === className) {
                classes.splice(i, 1);
                break;
            }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    // Making the elements active and calling the toggleClass function to add CSS class to these active elements.
    function toggleAll(e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    }

    // Function for getting the latest block mined from ethereum main network and also to fetch timsStamp, Transaction Count and Block reward for the latest block mined.
    function getLatestBlockDetails() {
        try {
            web3 = new Web3(window.ethereum);   // Creating the reference of Web3.

            // Get Block Number of latest block mined
            web3.eth.getBlockNumber(function (error, result) {
                if (!error) {
                    var blockNumber = result    // Storing the block Number for further use.

                    // Get the number of transactions count from the block number of latest block mined.
                    web3.eth.getBlockTransactionCount(blockNumber, function (error, result) {
                        if (!error) {
                            var blockTransactionCount = result  //  Storing the transaction count fetched.
                            document.getElementById('transactionCount').innerHTML = blockTransactionCount;  // Setting the Transaction Count value in HTML page.
                        }
                    })

                    // Fetching the more block info (like time stamp and block reward in ethers) using the etherscan api
                    axios.get('https://api.etherscan.io/api?module=block&action=getblockreward&blockno=' + blockNumber)
                        .then(function (response) {
                            var currentBlock = response.data.result;    // Storing the Block Object containg whole block information.
                            document.getElementById('blockNumber').innerHTML = blockNumber;             //  Setting the block Number value in HTML page.
                            blockTimeStampInUnix = currentBlock["timeStamp"];                           // Fetching timeStamp value from Block Object (In UNIX).
                            unixTimeStampToDateObj = new Date(blockTimeStampInUnix * 1000);             //  Converting the unix time stamp to date object.
                            unixTimeStampInUtcString = unixTimeStampToDateObj.toUTCString().slice(5);   // Converting date object of timestamp to utc string for human readability.
                            document.getElementById('timeStamp').innerHTML = unixTimeStampInUtcString;  // Setting the time stamp value in HTML page.
                            document.getElementById('blockReward').innerHTML = currentBlock["blockReward"] / 1000000000000000000;   //Setting the block reward value in HTML (Also, coverting the block reward from wei unit to ethers.)
                        })
                        .catch(function (error) {
                            console.log("Error response received from api: " + error);                  //  For capturing the error occured while fetching the details from etherscan api.
                        })
                }
                else
                    console.error(error);       //  Capturing error if getBlockNumber function fails to respond with block details.
            })
        }
        catch (error) {
            if (error.toString().toLowerCase().includes("referenceerror")) {
                alert("Metamask is not installed into the browser. Click 'OK' to continue..!!")
                window.location.href = 'https://metamask.io/';      //  Redirectly to metamask website for metamask installation, if it is not installed into the browser already.
            }
            else {
                console.log("Exception occured: " + error)          //  Capturing error other than Web3 reference error.
            }
        }
    }

    //  Calling this function to display the details of the latest block mined on webpage load.
    getLatestBlockDetails();

    //  Calling getLatestBlockDetails() after every 2000ms interval of time. 
    setInterval(function () {
        getLatestBlockDetails();
    }, 2000);

    menuLink.onclick = function (e) {
        toggleAll(e);
    };

    content.onclick = function (e) {
        if (menu.className.indexOf('active') !== -1) {
            toggleAll(e);
        }
    };

    //  Adding Event listener on 'username' input.
    document.getElementById("name").onchange = function (e) {
        // Enabling the submit button if both username and preferred current is given imputs.
        enableCrptoVotingSubmitButton();
    }

    //  Adding Event listener on 'Preferred cryptocurrency' select option.
    document.getElementById("state").onchange = function (e) {
        // Enabling the submit button if both username and preferred current is given imputs.
        enableCrptoVotingSubmitButton();
    }

    //  Function for making the crytpcurrency voting submit button enable.
    function enableCrptoVotingSubmitButton() {
        if (document.getElementById('name').value && document.getElementById('state').value) {
            if (document.getElementById('state').value != 'Select')
                document.getElementById("submitDetails").disabled = false;
        }
    }

    // Adding Event listener on 'submitDetails'. On click of button, the values of voting number for crytocurrencies will be displayed
    // and corresponding to that bar chart will also generated.
    document.getElementById('submitDetails').onclick = function (e) {

        var userDetails = {};               //  Creating the userDetails for storing username.
        var crytocurrencyVoteValue = 0;     //  Creating variable for storing selected cryptocurrency vote value.

        //  Set the vote count for selected cryptocurrency.
        if (document.getElementById('state').value !== 'Select') {
            userDetails['name'] = document.getElementById('name').value;
            userDetails['state'] = document.getElementById('state').value;
            crytocurrencyVoteValue = cryptocurrencyTrends[userDetails['state']] ? cryptocurrencyTrends[userDetails['state']] + 1 : 1;
            cryptocurrencyTrends[userDetails['state']] = crytocurrencyVoteValue
        }

        document.getElementById('userForm').reset();                //  Reset the 'userFrom' after the previous vote has done for the next vote input.
        document.getElementById("submitDetails").disabled = true;   //  Disabling the submit button until user provides the input to the form again for next vote.

        var userDetailsData = JSON.parse(localStorage.getItem("userDetails")) || [];    //  Fetching the userDetails from the local storage and set the variable to empty array if userDetails from local storage of browser is empty.

        //  Setting the cryptocurrencies vote value in the HTML page.
        document.getElementById('Bitcoin').innerHTML = cryptocurrencyTrends["Bitcoin"] || 0;
        document.getElementById('Ethereum').innerHTML = cryptocurrencyTrends["Ethereum"] || 0;
        document.getElementById('Monero').innerHTML = cryptocurrencyTrends["Monero"] || 0;
        document.getElementById('Cardano').innerHTML = cryptocurrencyTrends["Cardano"] || 0;

        userDetailsData.push(userDetails);  //  Set userDetailsData variable.

        localStorage.setItem("userDetails", JSON.stringify(userDetailsData));                   //  Set user details in local storage of the browser.
        localStorage.setItem("cryptocurrencyTrends", JSON.stringify(cryptocurrencyTrends));     //  Set cryptocurrency trends in the local storage of the browser.

        //  Calling function to create the bar chart.
        makeCryptocurrencyTrendsChart();
    }

    var displayEtherBalanceContainer = document.getElementById("displayEtherBalance");  //  Get the reference of the div tag of Ether Balance.
    var pTag = document.createElement('p');                                             //  Creating the 'p' tag for displacing the ehter balance of the user.

    //  Add Event listener on 'submitUserAccountAddress' button to get the user's ether balance from an api and displaying on the webpage.
    document.getElementById("submitUserAccountAddress").addEventListener("click", function (event) {
        event.preventDefault();     //  Handling the default actions of the click event.
        usersAccountAddress = document.getElementById("userAccountAddress").value   //  Fetching the user's account address from the webpage.

        //  Get the user's ether balance from etherscan ropsten network using user's account address.
        axios.get('https://api-ropsten.etherscan.io/api?module=account&action=balance&address=' + usersAccountAddress + '&tag=latest')
            .then(function (response) {
                //  Check usersAccountAddress should not be null.
                if (usersAccountAddress) {
                    userAccountWeiBalance = response.data["result"];    // Storing the user's balance in wei units.
                    userAccountEtherBalance = userAccountWeiBalance / 1000000000000000000;  // Converting the wei to ethers.

                    // Check User address entered is valid, if valid then api returns ether balance else api returns NaN.
                    if (userAccountEtherBalance) {
                        pTag.innerText = "User's Ether Balance: " + userAccountEtherBalance;    //  Setting the User's Ether Balance in the 'p' Tag to display on the webpage.
                        displayEtherBalanceContainer.appendChild(pTag);                         //  Appending the 'p' tag to the 'div' tag for propagating the user's ether balance on UI.
                    }
                    else {
                        if (displayEtherBalanceContainer.hasChildNodes(pTag))
                            displayEtherBalanceContainer.removeChild(pTag);                 //  Remove 'p' tag if wrong input is provided and clicked on submit button.
                        alert("Please enter a valid account address. User not found..!!");  //  Error message pop up for wrong user's address enterd.
                    }
                }
                else {
                    if (displayEtherBalanceContainer.hasChildNodes(pTag))
                        displayEtherBalanceContainer.removeChild(pTag);                         // Remove 'p' tag if empty user address and clicked on submit button.
                    alert("Please enter account address for getting ether balance details")     // Error message pop up for empty user address field.
                }
            })
            .catch(function (error) {
                alert("Error occured in api: " + error);            // Capturing error if api call gets failed.
            })
        document.getElementById('userEtherAccountForm').reset();    //  Reset the user's Ether Account form for allowing user to enter new user address.
    })

    //  Function for creating the bar chart for the cryptocurrencies voting
    function makeCryptocurrencyTrendsChart() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(cryptocurrencyTrends),  //  Labels will be displayed like Bitcoin, Ethereum etc. and depends upon which keys are presnet in Object.
                datasets: [{
                    label: 'No. of Votes',
                    data: [...Object.keys(cryptocurrencyTrends).map(key => cryptocurrencyTrends[key])],     // Display the number of votes for particular cryptocurrencies.
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                events: [],     //  Handling the default action of the event.
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

}(this, this.document));
