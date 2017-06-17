# You may exclude certain drives (separate with a pipe)
# Example: exclude = 'MyBook' or exclude = 'MyBook|WD Passport'
exclude   = 'NONE'

# Use base 10 numbers, i.e. 1GB = 1000MB. Leave this true to show disk sizes as
# OS X would (since Snow Leopard)
base10       = true

# appearance
filledStyle  = false # set to true for the second style variant. bgColor will become the text color

width        = '367px'
barHeight    = '0px'
labelColor   = '#fff'
usedColor    = '#d7051d'
freeColor    = '#525252'
bgColor      = '#fff'
borderRadius = '3px'
bgOpacity    = 0.9

# You may optionally limit the number of disk to show
maxDisks: 10

command: "ps axo \"rss,pid,ucomm\" | sort -nr | tail +1 | head -n4 | awk '{printf \"%8.0f MB,%s,%s\\n\", $1/1024, $3, $2}'"

refreshFrequency: 20000

style: """
  // Change bar height
  bar-height = 0px

  // Align contents left or right
  widget-align = left

  // Position this where you want
  top 10px
  left 10px

  // Statistics text settings
  color #fff
  font-family Helvetica Neue
  background rgba(#000, .5)
  padding 10px 10px 0px
  border-radius 5px

  .container
    width: 300px
    text-align: widget-align
    position: relative
    clear: both

  .container:not(:first-child)
    margin-top: 20px

  .widget-title
    text-align: widget-align

  .stats-container
    margin-bottom 0px
    border-collapse collapse

  td
    font-size: 14px
    font-weight: 300
    color: rgba(#fff, .9)
    text-shadow: 0 1px 0px rgba(#000, .7)
    text-align: widget-align

  td.pctg
    float: right

  .widget-title, p
    font-size 10px
    text-transform uppercase
    font-weight bold

  .label
    font-size 8px
    text-transform uppercase
    font-weight bold

"""

humanize: (sizeString) ->
  sizeString + 'B'


render: ->
  """
  <div class="container">
  <div class="widget-title">RAM HOGS</div>
  <table class="stats-container" width="100%">
    <tr>
      <td class='col1'></td>
      <td class='col2'></td>
      <td class='col3'></td>
      <td class='col4'></td>
    </tr>
  </table>
  </div>
"""

update: (output, domEl) ->
  processes = output.split('\n')
  table     = $(domEl).find('table')

  renderProcess = (cpu, name, id) ->
      "#{cpu}<p class='label'>#{name}</p>" 

  for process, i in processes
    args = process.split(',')
    table.find(".col#{i+1}").html renderProcess(args...)