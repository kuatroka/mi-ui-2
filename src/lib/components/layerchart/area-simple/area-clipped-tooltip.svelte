<script lang="ts">
    import {scaleOrdinal, scaleTime } from 'd3-scale';
    import { flatGroup } from 'd3-array';
    import { stack } from 'd3-shape';
    import { format as formatDate } from 'date-fns';
    import { PeriodType, format } from 'svelte-ux';
    import {Chart,  Svg, Axis, Area, Tooltip, TooltipItem, Highlight, Point, Text,
    LinearGradient, RectClipPath, AreaStack } from 'layerchart'
    // import { createDateSeries } from 'layerchart/genData';
    import { createDateSeries } from '../../../../../node_modules/layerchart/dist/utils/genData';
    import { appleStock} from './dateSeries';
    export let data = appleStock;    
    export let x: string = 'date';
    export let y: string = 'value';


</script>

<div class="h-[400px] border rounded">
    <Chart
      data={data}
      x={x}
      xScale={scaleTime()}
      y={y}
      yDomain={[0, null]}
      yNice
      padding={{ top: 48, bottom: 24 }}
      tooltip
      let:width
      let:height
      let:padding
      let:tooltip
    >
      <Svg>
        <LinearGradient
          class="from-chart/50 to-chart/0"
          vertical
          let:url
        >
          <Area
            line={{ class: "stroke-2 stroke-chart opacity-20" }}
            fill={url}
          />
          <RectClipPath
            x={0}
            y={0}
            width={tooltip.data ? tooltip.x : width}
            {height}
            spring
          >
            <Area line={{ class: "stroke-2 stroke-chart" }} fill={url} />
          </RectClipPath>
        </LinearGradient>
        <Highlight
          points
          lines={{ class: "stroke-chart [stroke-dasharray:unset]" }}
        />
        <Axis placement="bottom" ticks={6}
        labelProps={{ class:"fill-primary" }}
        />
        <!-- labelProps={{ class:"fill-primary; stroke-secondary" }} -->
        <!-- <Text labelProps={{ class:"stroke-primary" }} /> -->
      </Svg>
  
      <Tooltip
        y={48}
        xOffset={4}
        variant="none"
        class="text-sm font-semibold text-chart/100 leading-3"
        let:data
      >
         ${format(data[y], "metric")}
      </Tooltip>
  
      <Tooltip
        x={4}
        y={4}
        variant="none"
        class="text-sm font-semibold leading-3"
        let:data
      >
        {formatDate(data[x], 'y QQQ')}
      </Tooltip>
  
      <Tooltip
        x="data"
        y={height + padding.top + 2}
        anchor="top"
        variant="none"
        class="text-sm font-semibold bg-chart text-white leading-3 px-2 py-1 rounded whitespace-nowrap"
        let:data
      >
        {formatDate(data[x], 'y QQQ')}
      </Tooltip>
    </Chart>
  </div>

  <!-- <style>
    :global(.x-axis .tick text) {
      @apply text-lg; /* Use the appropriate Tailwind font size class */
    }
  </style> -->