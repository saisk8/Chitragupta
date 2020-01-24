/* eslint-disable no-undef */
const CELL_SIZE = 14;
const NUMBER_OF_COLORS = 6;

window.onload = () => {
  function createHeatMap(data, startYear) {
    const width = 900;
    const height = 110;
    const dx = 35;
    const gridClass = 'js-date-grid day';
    const formatColor = d3
      .scaleQuantize()
      .domain([0, 10])
      .range(d3.range(NUMBER_OF_COLORS).map(d => `color${d}`));

    const heatmapSvg = d3
      .select('.js-heatmap')
      .selectAll('svg.heatmap')
      .enter()
      .append('svg')
      .data(d3.range(startYear))
      .enter()
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'color');

    // Add a grid for each day between the date range.
    const rect = heatmapSvg.append('g').attr('transform', `translate(${dx},0)`);

    // Add year label.
    rect
      .append('text')
      .attr('transform', `translate(-9,${CELL_SIZE * 3.5})rotate(-90)`)
      .style('text-anchor', 'middle')
      .text(d => d);

    rect
      .selectAll('.day')
      // The heatmap will contain all the days in that year.
      .data(d => d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
      .enter()
      .append('rect')
      .attr('class', gridClass)
      .attr('width', CELL_SIZE)
      .attr('height', CELL_SIZE)
      .attr('x', d => d3.timeFormat('%U')(d) * CELL_SIZE)
      .attr('y', d => d.getDay() * CELL_SIZE)
      .attr('data-toggle', 'tooltip')
      .datum(d3.timeFormat('%Y-%m-%d'))
      // Add the grid data as a title attribute to render as a tooltip.
      .attr('title', d => {
        const countData = data.dates[d];
        const date = d3.timeFormat('%b %d, %Y')(new Date(d));
        if (!countData || !countData.count) return `Nothing`;
        if (countData.count === 1) return `1 post on ${date}`;
        return `${countData.count} posts on ${date}`;
      })
      .attr('date', d => d)
      // Add bootstrap's tooltip event listener.
      .call(() =>
        $('[data-toggle="tooltip"]').tooltip({
          container: 'body',
          placement: 'top',
          position: { my: 'top' }
        })
      )
      // Add the colors to the grids.
      .filter(d => dates.indexOf(d) > -1)
      .attr('class', d => `${gridClass} ${formatColor(data.dates[d].count)}`);

    // Render x axis to show months
    d3.select('.js-months')
      .selectAll('svg.months')
      .enter()
      .append('svg')
      .data([1])
      .enter()
      .append('svg')
      .attr('width', 800)
      .attr('height', 20)
      .append('g')
      .attr('transform', 'translate(0,10)')
      .selectAll('.month')
      .data(() => d3.range(12))
      .enter()
      .append('text')
      .attr('x', d => d * (4.5 * CELL_SIZE) + dx)
      .text(d => d3.timeFormat('%b')(new Date(0, d + 1, 0)));
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
      document.getElementById('svalue').innerHTML = sCount < 1 ? 'M' : sCount;
    },
    false
  );
  document.getElementById('splus').addEventListener(
    'click',
    () => {
      sCount += 1;
      document.getElementById('svalue').innerHTML = sCount < 1 ? 'M' : sCount;
    },
    false
  );
  document.getElementById('log').addEventListener(
    'click',
    () => {
      const sms = document.getElementById('svalue').innerHTML;
      const mms = document.getElementById('mvalue').innerHTML;
      if (sms === 'S' || mms === 'M') {
        document.getElementById('err').innerHTML = 'You did not do anything';
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
          document.getElementById('err').innerHTML = JSON.stringify(response.data);
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
      window.location.href = '/data';
    },
    false
  );
  // const yearFormat = d3.timeFormat('%Y');
  // const year = yearFormat(new Date());
  // createHeatMap(data, year);
};
