/* eslint-disable no-undef */

window.onload = () => {
  function createCard(data) {
    const date = new Date(data.date);
    return `<div class="card border-danger mb-3 w-100">
              <div class="card-header">
                Date: ${date}
              </div>
              <div class="card-body">
                <p class='text-danger'> Number of sm: ${data.sms}
                <p class='text-warning'> Number of mas: ${data.mms}
              </div>
            </div>`;
  }

  let mCount = 0;
  let sCount = 0;
  document.getElementById('mminus').addEventListener(
    'click',
    () => {
      mCount -= 1;
      document.getElementById('mvalue').innerHTML = mCount < 1 ? 'M' : mCount;
    },
    false
  );
  document.getElementById('mplus').addEventListener(
    'click',
    () => {
      mCount += 1;
      document.getElementById('mvalue').innerHTML = mCount < 1 ? 'M' : mCount;
    },
    false
  );
  document.getElementById('sminus').addEventListener(
    'click',
    () => {
      sCount -= 1;
      document.getElementById('svalue').innerHTML = sCount < 1 ? 'S' : sCount;
    },
    false
  );
  document.getElementById('splus').addEventListener(
    'click',
    () => {
      sCount += 1;
      document.getElementById('svalue').innerHTML = sCount < 1 ? 'S' : sCount;
    },
    false
  );
  document.getElementById('log').addEventListener(
    'click',
    () => {
      const sms = document.getElementById('svalue').innerHTML;
      const mms = document.getElementById('mvalue').innerHTML;
      if (sms === 'S' && mms === 'M') {
        document.getElementById(
          'err'
        ).innerHTML = `<h5 class='text-info'>You did not do anything -_-</h5>`;
        return;
      }
      axios
        .post('/new', {
          log: 'yes',
          date: new Date(),
          sms,
          mms
        })
        .then(response => {
          if (response.data === 'pass')
            document.getElementById('err').innerHTML = `<h5 class='text-success'>Log stored</h5>`;
          else
            document.getElementById(
              'err'
            ).innerHTML = `<h5 class='text-danger'>An error occured, try again</h5>`;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    },
    false
  );
  document.getElementById('data').addEventListener(
    'click',
    () => {
      axios
        .get('/data')
        .then(response => {
          let content = '';
          if (response.data.length) {
            content += createCard(d);
          } else {
            content = `<h3 class='text-success'>Nice going, keep it up!</h3>`;
          }
          document.getElementById('results').innerHTML = content;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    },
    false
  );
};
