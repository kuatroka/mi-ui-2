<script lang="ts">
    import {scaleTime } from 'd3-scale';

    import { format } from 'date-fns';
    import { PeriodType, formatDate, format as formatMetric } from 'svelte-ux';
    import {Chart,  Svg, Axis, Bars, Tooltip, TooltipItem, Highlight, Spline } from 'layerchart'
    import { createDateSeries } from '../../../../../node_modules/layerchart/dist/utils/genData';
    export let data = createDateSeries({
    count: 100,
    min: 0.80,
    max: 1.5,
    value: 'number',
    keys: ['assets', 'baseline'],
  });

  export let x: string = 'date';
  export let y: string = 'assets';
  let maxValue = Math.max(...data.map(item => item[y]));
  let minValue = Math.min(...data.map(item => item[y]));


</script>

<div class="h-[400px] p-4 border rounded group">
  <Chart
    {data}
    x={x}
    xScale={scaleTime()}
    y={y}
    yDomain={[minValue * 0.9, maxValue * 1.1]}
    yNice
    padding={{ left: 26, bottom: 24 }}
    tooltip
  >
    <Svg>
      <Axis placement="left" grid  format={(d) => formatMetric(d, 'decimal')}/>
      <Axis placement="bottom" ticks={6}
      rule
      />
<Spline class="stroke-2 stroke-chart"/>
<Highlight points lines />
    </Svg>
    <Tooltip header={(data) => format(data[x], 'y QQQ')} let:data>
      <TooltipItem label={y} value={formatMetric(data[y], 'decimal')} />
    </Tooltip>
  </Chart>
</div>



