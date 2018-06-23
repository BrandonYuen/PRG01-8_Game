/// <reference path="UIScreen.ts"/>

class LevelCompleteScreen extends UIScreen {
    constructor() {
        super()

        // Create and place start button
        let nextBtn = document.createElement('button')
        nextBtn.classList.add('btn')
        nextBtn.innerHTML = 'NEXT LEVEL'
        this.domElement.appendChild(nextBtn)

        // Create content div
        let content = document.createElement('div')
        content.classList.add('content')

        // Create header p
        let p = document.createElement('p')
        p.innerHTML = 'LEVEL '+(MapLoader.currentMapIndex+1)+' COMPLETED!'
        content.appendChild(p)

        // Create table
        let table = document.createElement('table')
        let tr_score = document.createElement('tr')
            let score_title = document.createElement('td')
            score_title.appendChild(document.createTextNode('POINTS:'))
            tr_score.appendChild(score_title)
            let score_value = document.createElement('td')
            score_value.appendChild(document.createTextNode(Game.levelPoints.toString()))
            tr_score.appendChild(score_value)
        table.appendChild(tr_score)

        //Calculate time
        let now = new Date()
        let duration = (now.valueOf() - Game.levelStartTime.valueOf()) / 1000
        duration = Math.floor(duration)

        let tr_time = document.createElement('tr')
            let time_title = document.createElement('td')
            time_title.appendChild(document.createTextNode('TIME:'))
            tr_time.appendChild(time_title)
            let time_value = document.createElement('td')
            time_value.appendChild(document.createTextNode(duration.toString()+'s'))
            tr_time.appendChild(time_value)
        table.appendChild(tr_time)

        content.appendChild(table)

        // Create horizontal line
        let line = document.createElement('hr')
        content.appendChild(line)

        // Create table
        let table2 = document.createElement('table')
        let tr_totalScore = document.createElement('tr')
            let totalScore_title = document.createElement('td')
            totalScore_title.appendChild(document.createTextNode('TOTAL POINTS:'))
            tr_totalScore.appendChild(totalScore_title)
            let totalScore_value = document.createElement('td')
            totalScore_value.appendChild(document.createTextNode(Game.points.toString()))
            tr_totalScore.appendChild(totalScore_value)
        table2.appendChild(tr_totalScore)

        //Calculate time
        let now2 = new Date()
        let duration2 = (now.valueOf() - Game.startTime.valueOf()) / 1000
        duration2 = Math.floor(duration2)

        let tr_totalTime = document.createElement('tr')
            let totalTime_title = document.createElement('td')
            totalTime_title.appendChild(document.createTextNode('TOTAL TIME:'))
            tr_totalTime.appendChild(totalTime_title)
            let totalTime_value = document.createElement('td')
            totalTime_value.appendChild(document.createTextNode(duration2.toString()+'s'))
            tr_totalTime.appendChild(totalTime_value)
        table2.appendChild(tr_totalTime)

        content.appendChild(table2)


        this.domElement.appendChild(content)
    }

    public remove() : void {
        super.remove()
    }

    public clickHandler(e: MouseEvent): void {
        let target = e.target as HTMLElement
        if (target.nodeName === 'BUTTON') {
            Game.screen.remove()
            Game.state = new Play()
        }
    }
}