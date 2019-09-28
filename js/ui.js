(function (window, document) {

    var cryptoCoinsData = []
    var bitcoinTrends = JSON.parse(localStorage.getItem("bitcoinTrends")) || {};
    makeBlockchainTrendsChart();
    document.getElementById("submitDetails").disabled = true;

    // console.log(bitcoinTrends)
    // if (bitcoinTrends) {
    //     cryptoCoins = Object.keys(bitcoinTrends)
    //     cryptoCoins.forEach((item) => {
    //         cryptoCoinsData.push(bitcoinTrends[item])
    //     })
    // }

    var layout = document.getElementById('layout'),
        menu = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink'),
        content = document.getElementById('main');

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

    function toggleAll(e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    }

    // function getLatestBlock2() {
    //     var sync = web3.eth.syncing;
    //     console.log(sync);
    // }

    // setInterval(function () {
    //     axios.get('https://api.blockcypher.com/v1/eth/main')
    //         .then(function (response) {
    //             var blockValue = response.data;
    //             console.log("Block number: " + response.data["height"]);

    //             blockNumber = blockValue["height"]

    //             axios.get('https://api.etherscan.io/api?module=block&action=getblockreward&blockno=' + blockNumber + '&apikey=YourApiKeyToken')
    //                 .then(function (response) {
    //                     previousBlockNumebr = blockNumber;
    //                     var currentBlock = response.data.result;
    //                     document.getElementById('currentHeight').innerHTML = blockValue["height"];
    //                     document.getElementById('peerCount').innerHTML = blockValue["peer_count"];
    //                     document.getElementById('blockNumber').innerHTML = currentBlock["blockNumber"];
    //                     document.getElementById('blockReward').innerHTML = currentBlock["blockReward"];
    //                 });
    //         })
    //         .catch(function (error) {
    //             console.log("Error: " + error);
    //         })

    // }, 100000);
    function getLatestBlockDetails() {
        web3 = new Web3(window.ethereum);
        // let blockNumber = 0;
        web3.eth.getBlockNumber(function (error, result) {
            if (!error) {
                console.log(result);
                var blockNumber = result

                web3.eth.getBlockTransactionCount(blockNumber, function (error, result) {
                    if (!error) {
                        console.log(result)
                        var blockTransactionCount = result
                        document.getElementById('transactionCount').innerHTML = blockTransactionCount;
                    }
                })

                axios.get('https://api.etherscan.io/api?module=block&action=getblockreward&blockno=' + blockNumber + '&apikey=YourApiKeyToken')
                    .then(function (response) {
                        previousBlockNumebr = blockNumber;
                        var currentBlock = response.data.result;
                        console.log(currentBlock)
                        document.getElementById('blockNumber').innerHTML = blockNumber;
                        // document.getElementById('peerCount').innerHTML = currentBlock["blockMiner"];
                        blockTimeStampInUnix = currentBlock["timeStamp"];
                        unixTimeStampToDateObj = new Date(blockTimeStampInUnix * 1000);
                        unixTimeStampInUtcString = unixTimeStampToDateObj.toUTCString().slice(5);
                        document.getElementById('timeStamp').innerHTML = unixTimeStampInUtcString;
                        document.getElementById('blockReward').innerHTML = currentBlock["blockReward"] / 1000000000000000000;
                    })
                    .catch(function (error) {
                        console.log("Error: " + error);
                    })
            }
            else
                console.error(error);
        })
    }
    getLatestBlockDetails();

    setInterval(function () {
        getLatestBlockDetails();
        // web3 = new Web3(window.ethereum);
        // // let blockNumber = 0;
        // web3.eth.getBlockNumber(function (error, result) {
        //     if (!error) {
        //         console.log(result);
        //         var blockNumber = result

        //         web3.eth.getBlockTransactionCount(blockNumber, function (error, result) {
        //             if (!error) {
        //                 console.log(result)
        //                 var blockTransactionCount = result
        //                 document.getElementById('peerCount').innerHTML = blockTransactionCount;
        //             }
        //         })

        //         axios.get('https://api.etherscan.io/api?module=block&action=getblockreward&blockno=' + blockNumber + '&apikey=YourApiKeyToken')
        //             .then(function (response) {
        //                 previousBlockNumebr = blockNumber;
        //                 var currentBlock = response.data.result;
        //                 console.log(currentBlock)
        //                 document.getElementById('currentHeight').innerHTML = blockNumber;
        //                 // document.getElementById('peerCount').innerHTML = currentBlock["blockMiner"];
        //                 document.getElementById('blockNumber').innerHTML = currentBlock["blockNumber"];
        //                 document.getElementById('blockReward').innerHTML = currentBlock["blockReward"] / 1000000000000000000;
        //             })
        //             .catch(function (error) {
        //                 console.log("Error: " + error);
        //             })
        //     }
        //     else
        //         console.error(error);
        // })
        console.log("Block number: " + blockNumber)
        // console.log("Block number: " + response.data["height"]);

        // blockNumber = blockValue["height"]

    }, 2000);

    menuLink.onclick = function (e) {
        toggleAll(e);
    };

    content.onclick = function (e) {
        if (menu.className.indexOf('active') !== -1) {
            toggleAll(e);
        }
    };

    document.getElementById("name").onchange = function (e) {
        if (document.getElementById('name').value && document.getElementById('state').value) {
            if (document.getElementById('state').value != 'Select')
                document.getElementById("submitDetails").disabled = false;
        }
        // document.getElementById("submitDetails").disabled = true;
    }

    document.getElementById("state").onchange = function (e) {
        if (document.getElementById('name').value && document.getElementById('state').value) {
            if (document.getElementById('state').value != 'Select')
                document.getElementById("submitDetails").disabled = false;
        }
        // document.getElementById("submitDetails").disabled = true;
    }

    document.getElementById('submitDetails').onclick = function (e) {

        var userDetails = {};
        var bitcoinTrend = {};
        // userDetails['name'] = document.getElementById('name').value;
        // userDetails['accountNumber'] = document.getElementById('accountNumber').value;
        // userDetails['email'] = document.getElementById('email').value;
        var newValue = 0;
        if (document.getElementById('state').value !== 'Select') {
            userDetails['name'] = document.getElementById('name').value;
            userDetails['state'] = document.getElementById('state').value;
            newValue = bitcoinTrends[userDetails['state']] ? bitcoinTrends[userDetails['state']] + 1 : 1;
            bitcoinTrends[userDetails['state']] = newValue
        }


        document.getElementById('userForm').reset();
        document.getElementById("submitDetails").disabled = true;

        var userDetailsData = JSON.parse(localStorage.getItem("userDetails")) || [];

        // var newValue = bitcoinTrends[userDetails['state']] ? bitcoinTrends[userDetails['state']] + 1 : 1;

        // bitcoinTrends[userDetails['state']] = newValue;

        document.getElementById('Bitcoin').innerHTML = bitcoinTrends["Bitcoin"] || 0;
        document.getElementById('Etherium').innerHTML = bitcoinTrends["Etherium"] || 0;
        document.getElementById('Monero').innerHTML = bitcoinTrends["Monero"] || 0;
        document.getElementById('Cardano').innerHTML = bitcoinTrends["Cardano"] || 0;

        userDetailsData.push(userDetails);

        localStorage.setItem("userDetails", JSON.stringify(userDetailsData));
        localStorage.setItem("bitcoinTrends", JSON.stringify(bitcoinTrends));

        // document.getElementById('myChart').setAttribute('style' , "display: block")
        console.log(bitcoinTrends)
        makeBlockchainTrendsChart();
        // console.log(Object.keys(bitcoinTrends).map(key => bitcoinTrends[key]))
        // console.log(myChart.data.datasets[0].data)
    }

    var displayEtherBalanceContainer = document.getElementById("displayEtherBalance")
    var pTag = document.createElement('p')
    document.getElementById("submitUserAccountAddress").addEventListener("click", function (event) {
        event.preventDefault();
        usersAccountAddress = document.getElementById("userAccountAddress").value

        console.log("User Address2: " + usersAccountAddress)
        axios.get('https://api-ropsten.etherscan.io/api?module=account&action=balance&address=' + usersAccountAddress + '&tag=latest')
            .then(function (response) {
                if (usersAccountAddress) {
                    // console.log(response.data);
                    userAccountWeiBalance = response.data["result"];
                    userAccountEtherBalance = userAccountWeiBalance / 1000000000000000000;
                    console.log("Account Balance: " + userAccountEtherBalance);

                    pTag.innerText = "User's Ether Balance: " + userAccountEtherBalance;
                    // pTag.setAttribute('text', userAccountEtherBalance)
                    displayEtherBalanceContainer.appendChild(pTag);
                }
                else {
                    alert("Please enter account address for getting ether balance details")
                }

            })
        document.getElementById('userEtherAccountForm').reset();
    })

    function makeBlockchainTrendsChart() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(bitcoinTrends),
                datasets: [{
                    label: '# of Votes',
                    data: [...Object.keys(bitcoinTrends).map(key => bitcoinTrends[key])],
                    // data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        // 'rgba(153, 102, 255, 0.2)',
                        // 'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        // 'rgba(153, 102, 255, 1)',
                        // 'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                events: [],
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
