const main = async function () {

  const scope = angular.element(document.querySelector('mee-card-group')).scope();
  
  // check if the unread count has updated and pass it up to the wavebox script
  let prev
  const setCount = async function (next) {
    if (next !== prev) {
      window.postMessage({
        type: 'msrewards_count',
        count: next
      }, '*' /* targetOrigin: any */);
      prev = next;
    }
  }

  // get the unread messages and pass them up to the wavebox script
  const getMessages = async function () {
    const dailySet = scope.$ctrl.dailySets[0];
    let messages = [];
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    dailySet.forEach(item => {
      if (!item.complete) {
        messages.push({
          id: item.promotionName,
          title: item.title,
          subtitle: item.subtitle,
          date: today
        });
      }
    });

    setCount(messages.length);

    window.postMessage({
      type: 'msrewards_messages',
      messages: messages
    }, '*' /* targetOrigin: any */);
  }

  // send an updated count and get messages to send to wavebox
  const sendDetails = async function() {
    await getMessages();
  }

  // add the event listener for when unreads change
  scope.$watch('$ctrl.dailySets[0]', sendDetails);

  // send the initial unreads on page load.
  sendDetails();
}

main()