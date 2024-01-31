<script lang="ts">
    import {scaleTime, scaleBand } from 'd3-scale';

    import { format } from 'date-fns';
    import { PeriodType, formatDate, format as formatMetric } from 'svelte-ux';
    import {Chart,  Svg, Axis, Bars, Tooltip, TooltipItem, Highlight, Spline } from 'layerchart'
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
    xScale={scaleTime()}
    y={y}
    yDomain={[0, null]}
    yNice
    padding={{ left: 26, bottom: 24 }}
    tooltip
  >
    <Svg>
      <Axis placement="left" grid  format={(d) => formatMetric(d, 'metric')}/>
        <Axis placement="bottom" ticks={6}

  rule
/>
<Spline class="stroke-2 fill-chart" />
<Highlight points lines />
    </Svg>
    <Tooltip header={(data) => format(data[x], 'y QQQ')} let:data>
      <TooltipItem label={y} value={formatMetric(data[y], 'integer')} />
    </Tooltip>
  </Chart>
</div>



