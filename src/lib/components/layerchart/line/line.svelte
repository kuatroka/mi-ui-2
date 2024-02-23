<script lang="ts">
    import {scaleTime } from 'd3-scale';

    import { format } from 'date-fns';
    import { PeriodType, formatDate, format as formatMetric } from 'svelte-ux';
    import {Chart,  Svg, Axis, Rule, Tooltip, TooltipItem, Highlight, Spline, Legend, Text } from 'layerchart'
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
  export let maxValue = Math.max(...data.map(item => item[y]))* 1.1;
  export let minValue = Math.min(...data.map(item => item[y]))* 0.9;
  export let showRule = true;
  export let ruleClass = 'stroke-2 stroke-red-400 [stroke-dasharray:4] [stroke-linecap:round]';


</script>

<div class="h-[400px] p-4 border rounded group">

  <Chart
  
    {data}
    x={x}
    xScale={scaleTime()}
    y={y}
    yDomain={[minValue, maxValue]}
    yNice
    padding={{ left: 16, bottom: 10 }}
    tooltip
  >
    <Svg>
      <Axis placement="left"   format={(d) => formatMetric(d, 'decimal')}/>
      <Axis placement="bottom" ticks={6} 
      labelProps={{ class:"fill-primary" }}
      />
      <!-- labelProps={{ class:"red" }} -->
      <!-- <Text value={'ratio'} x={6} y={-5} text-anchor="start"/> -->
    <Spline defined={(data) => data[y] != null} class="stroke-2 stroke-chart"/>
    <Highlight points lines />
    {#if showRule}
            <Rule
              y={1}
              class={ruleClass}
            />
          {/if}
        </Svg>
        <Tooltip header={(data) => format(data[x], 'y QQQ')} let:data>
          <TooltipItem label={y} value={formatMetric(data[y], 'decimal')} />
        </Tooltip>
        <!-- <Legend
      title="Daily change"
      tickFormat="percentRound"
    /> -->
  </Chart>
</div>



