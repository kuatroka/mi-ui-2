<script lang="ts">
    import {scaleTime } from 'd3-scale';
    import { format as formatDate } from 'date-fns';
    import { PeriodType, format } from 'svelte-ux';
    import {Chart,  Svg, Axis, Area, Tooltip, TooltipItem, Highlight} from 'layerchart'
    // import { createDateSeries } from '../../../../../node_modules/layerchart/dist/utils/genData';

    export let data: { date: Date; value: number }[];
    // export let data = createDateSeries({ count: 30, min: 50, max: 100, value: 'integer' });
</script>


<!-- <div class="h-[330px] p-4 border rounded"> -->
<Chart
    {data}
    x="date"
    xScale={scaleTime()}
    y="value"
    yDomain={[0, null]}
    yNice
    padding={{ left: 16, bottom: 24 }}
    tooltip
>
    <Svg>
    <Axis placement="left" grid rule />
    <Axis
        placement="bottom"
        format={(d) => format(d, PeriodType.CalendarYear, { variant: 'default' })}
        rule
        labelProps={{ class:"fill-primary" }}
    />
    <Area
    class="fill-chart/30"
    line={{ class: "stroke-2 stroke-chart" }}
    />
    <Highlight points lines />
    </Svg>
    <Tooltip header={(data) => formatDate(data.date, "eee, MMMM do")}  let:data>
    <TooltipItem label="value" value={data.value} />
    </Tooltip>
</Chart>
<!-- </div> -->

