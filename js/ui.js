(function (window, document) {

    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink'),
        content  = document.getElementById('main');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
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

    setInterval(function(){
        axios.get('https://api.blockcypher.com/v1/eth/main')
          .then(function(response){
            var blockValue = response.data;
            // console.log("Block number: " + response.data["height"]);
      
            blockNumber = blockValue["height"]
      
            axios.get('https://api.etherscan.io/api?module=block&action=getblockreward&blockno=' + blockNumber + '&apikey=YourApiKeyToken')
              .then(function(response){
                previousBlockNumebr = blockNumber;
                var currentBlock = response.data.result;
                document.getElementById('currentHeight').innerHTML = blockValue["height"];
                document.getElementById('peerCount').innerHTML = blockValue["peer_count"];
                document.getElementById('blockNumber').innerHTML = currentBlock["blockNumber"];
                document.getElementById('blockReward').innerHTML = currentBlock["blockReward"];
              });
          })
          .catch(function(error){
            console.log("Error: " + error);
          })
      
      }, 3000);

    menuLink.onclick = function (e) {
        toggleAll(e);
    };

    content.onclick = function(e) {
        if (menu.className.indexOf('active') !== -1) {
            toggleAll(e);
        }
    };

    document.getElementById('submitDetails').onclick = function(e){
        var userDetails = {};
        var bitcoinTrend = {};
        userDetails['name'] = document.getElementById('name').value;
        userDetails['accountNumber'] = document.getElementById('accountNumber').value;
        userDetails['email'] = document.getElementById('email').value;
        userDetails['state'] = document.getElementById('state').value;

        document.getElementById('userForm').reset();

        var userDetailsData = JSON.parse(localStorage.getItem("userDetails")) || [];

        var bitcoinTrends = JSON.parse(localStorage.getItem("bitcoinTrends")) || {};
        var newValue = bitcoinTrends[userDetails['state']] ? bitcoinTrends[userDetails['state']] + 1 : 1;

        bitcoinTrends[userDetails['state']] = newValue;

        document.getElementById('Bitcoin').innerHTML = bitcoinTrends["Bitcoin"] || 0;
        document.getElementById('Etherium').innerHTML = bitcoinTrends["Etherium"] || 0;
        document.getElementById('Monero').innerHTML = bitcoinTrends["Monero"] || 0;
        document.getElementById('Cardano').innerHTML = bitcoinTrends["Cardano"] || 0;

        userDetailsData.push(userDetails);

        localStorage.setItem("userDetails", JSON.stringify(userDetailsData));
        localStorage.setItem("bitcoinTrends", JSON.stringify(bitcoinTrends));
    }

}(this, this.document));
