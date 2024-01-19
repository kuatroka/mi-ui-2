<script lang="ts">
    import {scaleOrdinal, scaleTime, scaleBand } from 'd3-scale';

    import { format as formatDate } from 'date-fns';
    import { PeriodType, format } from 'svelte-ux';
    import {Chart,  Svg, Axis, Bars, Tooltip, TooltipItem, Highlight } from 'layerchart'
    // import { createDateSeries } from 'layerchart/genData';
    import { createDateSeries } from '../../../../../node_modules/layerchart/dist/utils/genData';
    export let data = createDateSeries({
    count: 30,
    min: 20,
    max: 100,
    value: 'integer',
    keys: ['value', 'baseline'],
  });
 


</script>

<div class="h-[300px] p-4 border rounded group">
  <Chart
    {data}
    x="date"
    xScale={scaleBand().padding(0.4)}
    y="value"
    yDomain={[0, null]}
    yNice
    padding={{ left: 16, bottom: 24 }}
    tooltip={{ mode: "band" }}
  >
    <Svg>
      <Axis placement="left" grid rule />
      <Axis
        placement="bottom"
        format={(d) => format(d, PeriodType.Day, "short")}
        rule
      />
      <Bars
        radius={4}
        strokeWidth={1}
        class="fill-chart-500 group-hover:fill-grey-300 transition-colors"
      />
      <Highlight
        area
        bar={{ class: "fill-chart-500", strokeWidth: 1, radius: 4 }}
      />
    </Svg>
    <Tooltip header={(data) => formatDate(data.date, 'y QQQ')} let:data>
      <TooltipItem label="Assets" value={format(data.value, "metric")} />
    </Tooltip>
  </Chart>
</div>


