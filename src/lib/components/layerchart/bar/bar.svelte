<script lang="ts">
    import {scaleTime, scaleBand } from 'd3-scale';

    import { format } from 'date-fns';
    import { PeriodType, formatDate, format as formatMetric } from 'svelte-ux';
    import {Chart,  Svg, Axis, Bars, Tooltip, TooltipItem, Highlight } from 'layerchart'
    import { createDateSeries } from '../../../../../node_modules/layerchart/dist/utils/genData';
	import { takeEvery } from 'layercake';
    export let data = createDateSeries({
    count: 30,
    min: 20,
    max: 100,
    value: 'integer',
    keys: ['value', 'baseline'],
  });

  export let x: string = 'date';
  export let y: string = 'assets';
  let maxValue = Math.max(...data.map(item => item[y]));


</script>

<div class="h-[400px] p-4 border rounded group">
  <Chart
    {data}
    x={x}
    xScale={scaleBand().padding(0.4)}
    y={y}
    yDomain={[0, maxValue]}
    yNice
    padding={{ left: 26, bottom: 24 }}
    tooltip={{ mode: "band" }}
  >
    <Svg>
      <Axis placement="left" grid  format={(d) => formatMetric(d, 'metric')}/>
      <Axis
  placement="bottom"  ticks={takeEvery(data.map(item => item.date),12)} tickSize={0}
  format={(d) => formatDate(d, PeriodType.CalendarYear)}
  rule
  labelProps={{
    // rotate: 315,
    textAnchor: "middle",
    // verticalAnchor: "middle",
    dy: 10,
    class:"fill-primary"
  }}
/>
      <Bars
        radius={4}
        strokeWidth={1}
        class="fill-chart group-hover:fill-gray-300 transition-colors"
      />
      <Highlight
      bar={{ class: "fill-chart", strokeWidth: 2, radius: 4 }}

        />
    </Svg>
    <Tooltip header={(data) => format(data[x], 'y QQQ')} let:data>
      <TooltipItem label={y} value={formatMetric(data[y], 'integer')} />
    </Tooltip>
  </Chart>
</div>



