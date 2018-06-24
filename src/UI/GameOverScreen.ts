/// <reference path="UIScreen.ts"/>

class GameOverScreen extends UIScreen {
    constructor() {
        super()

        // Create and place start button
        let nextBtn = document.createElement('button')
        nextBtn.classList.add('btn')
        nextBtn.innerHTML = 'TRY AGAIN'
        this.domElement.appendChild(nextBtn)

        // Create content div
        let content = document.createElement('div')
        content.classList.add('content')

        // Create header p
        let p = document.createElement('p')
        p.innerHTML = 'GAME OVER'
        p.style.color = '#e00d0d'
        content.appendChild(p)

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
        let duration2 = (now2.valueOf() - Game.startTime.valueOf()) / 1000
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
            Game.restart()
        }
    }
}