<script lang="ts">
    import {scaleTime, scaleOrdinal } from 'd3-scale';
    import { extent, flatGroup, ticks } from 'd3-array';

    import { format } from 'date-fns';
    import { PeriodType, formatDate, format as formatMetric } from 'svelte-ux';
    import {Chart,  Svg, Axis, Text, Tooltip, TooltipItem, Highlight, Spline } from 'layerchart'
    import { createDateSeries } from '../../../../../node_modules/layerchart/dist/utils/genData';
    import { pivotLonger } from '../../../../../node_modules/layerchart/dist/utils/pivot';


    let dataset: any;
    dataset = createDateSeries({
      count: 30,
      min: 10,
      max: 100,
      value: 'integer',
      keys: ['apples', 'bananas', 'num_new_ciks', 'num_stopped_ciks'],
    });
    
    export let series_columns = ['num_stopped_ciks', 'num_new_ciks', 'bananas'];
    export let category = 'type';
    export let metric_column = 'value'
    export let series_colours = ['var(--color-rose-400)', 'var(--color-emerald-500', 'black'];

    export let categoryColours: Record<string, string> = {};
    series_columns.forEach((column, index) => {
      categoryColours[column] = series_colours[index];
    });

    export let multiSeriesFlatData = pivotLonger(dataset, series_columns, category, metric_column);
    export let dataByCategory = flatGroup(multiSeriesFlatData, (d) => d[category]);

  let x: string = 'date';
  let y: string = metric_column;
  $: maxValue = Math.max(...multiSeriesFlatData.map(item => item[y]));
  $: minValue = Math.min(...multiSeriesFlatData.map(item => item[y]));


</script>
<!-- <pre>{JSON.stringify(data.slice(0,4), null, 2)}</pre> -->

<!-- <div class="h-[400px] p-4 border rounded"> -->
  <Chart
    data={multiSeriesFlatData}
    x={x}
    xScale={scaleTime()}
    y={y}
    yDomain={[minValue, maxValue]}
    yNice
    r={category}
    rScale={scaleOrdinal()}
    rDomain={Object.keys(categoryColours)}
    rRange={Object.values(categoryColours)}
    padding={{ left: 16, bottom: 24, right: 48 }}
    tooltip={{ mode: 'voronoi' }}
    let:tooltip
    let:rScale
  >
    <Svg>
      <Axis placement="left" grid rule />
      <Axis placement="bottom" ticks={6} />
      {#each dataByCategory as [category, data]}
                  {@const color =
                    tooltip.data == null || tooltip.data.type === category ? rScale(category) : '#ddd'}
        <Spline {data} class="stroke-2" stroke={color}>
          <svelte:fragment slot="end">
            <circle r={4} fill={color} />
            <Text
              value={category}
              verticalAnchor="middle"
              dx={6}
              dy={-2}
              class="text-xs"
              fill={color}
            />
          </svelte:fragment>
        </Spline>
      {/each}
      <Highlight points lines />
    </Svg>
    <!-- <Tooltip header={(data) => format(data[x], 'y QQQ')} let:data>
      <TooltipItem label={data[category]} value={data[y]} />
    </Tooltip> -->
    <!-- <Tooltip header={(data) => format(data[x], 'y QQQ')} let:data> -->
      <!-- {#each series_columns as key} -->
        <!-- <TooltipItem label={key} value={data[y]} /> -->
        <!-- need to sort out the tooltip to show for all categoreis not on the hovered one -->
      <!-- {/each} -->
    <!-- </Tooltip> -->
  </Chart>
<!-- </div> -->



