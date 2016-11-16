class CanvasPlayground {

    constructor() {

        this.canvas = document.getElementById('canvas');
        this.mode = 'idle';
        this.cometOffset = 0;
        this.gains = [0.4, 0.9, 0.3, 0.8];
        this.gainIdx = 0;
        this.gainMax = 0;
        this.gain = 0;
        this.gainMode = null;

    }

    drawET(size, state, gain) {

        const width = this.canvas.width;
        const height = this.canvas.height;

        const et = {
            top: [0.5, 0.27],
            bottom: [0.5, 0.73],
            leftTop: [0.2, 0.35],
            leftBottom: [0.2, 0.65],
            rightTop: [0.8, 0.35],
            rightBottom: [0.8, 0.65],
            leftMouth: [0.25, 0.55],
            centerMouth: [0.5, 0.60],
            rightMouth: [0.75, 0.55],
        };

        // Scale to width.

        for(let it of ['top', 'rightTop', 'rightBottom', 'bottom', 'leftBottom', 'leftTop', 'leftMouth', 'centerMouth', 'rightMouth']) {
            et[it] = et[it].map(value => value * size);
        }

        const context = this.canvas.getContext('2d');

        const radius = 20;

        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        let d = '';

        ['top', 'rightTop', 'rightBottom', 'bottom', 'leftBottom', 'leftTop'].forEach((pos, idx, arr) => {

            const prevPos = idx - 1 == -1 ? arr[arr.length - 1] : arr[idx - 1];
            const nextPos = idx +  1 == arr.length ? arr[0] : arr[idx + 1];

            const prevDeltaX = et[pos][0] - et[prevPos][0];
            const prevDeltaY = et[pos][1] - et[prevPos][1];
            const prevDelta = Math.sqrt(prevDeltaX * prevDeltaX + prevDeltaY * prevDeltaY);
            const unitedPrevDeltaX = prevDeltaX / prevDelta;
            const unitedPrevDeltaY = prevDeltaY / prevDelta;

            const deltaX = et[nextPos][0] - et[pos][0];
            const deltaY = et[nextPos][1] - et[pos][1];
            const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const unitedDeltaX = deltaX / delta;
            const unitedDeltaY = deltaY / delta;

            const prevEnd = [et[pos][0] - unitedPrevDeltaX * radius, et[pos][1] - unitedPrevDeltaY * radius];
            const start = [et[pos][0] + unitedDeltaX * radius, et[pos][1] + unitedDeltaY * radius];

            d += `M ${ prevEnd.join(' ') } `;
            //context.moveTo(...prevEnd);
            d += `Q ${ et[pos].join(' ') } ${ start.join(' ') } `;
            //context.quadraticCurveTo(...et[pos], ...start);

            d += `L ${ start.join(' ') } `;
            //context.lineTo(...start);

            const end = [et[nextPos][0] - unitedDeltaX * radius, et[nextPos][1] - unitedDeltaY * radius];

            d += `L ${ end.join(' ') } `;
            //context.lineTo(...end);

        });

        svgPath.setAttributeNS(null, 'd', d);

        context.strokeStyle = 'rgb(18, 222, 223)';
        context.fillStyle = 'rgb(18, 222, 223)';

        //context.setLineDash([2, 4]);

        // Draw outline.

        context.save();

        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 6;

        context.beginPath();

        ['top', 'rightTop', 'rightBottom', 'bottom', 'leftBottom', 'leftTop'].forEach((pos, idx, arr) => {

            const prevPos = idx - 1 == -1 ? arr[arr.length - 1] : arr[idx - 1];
            const nextPos = idx +  1 == arr.length ? arr[0] : arr[idx + 1];

            const prevDeltaX = et[pos][0] - et[prevPos][0];
            const prevDeltaY = et[pos][1] - et[prevPos][1];
            const prevDelta = Math.sqrt(prevDeltaX * prevDeltaX + prevDeltaY * prevDeltaY);
            const unitedPrevDeltaX = prevDeltaX / prevDelta;
            const unitedPrevDeltaY = prevDeltaY / prevDelta;

            const deltaX = et[nextPos][0] - et[pos][0];
            const deltaY = et[nextPos][1] - et[pos][1];
            const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const unitedDeltaX = deltaX / delta;
            const unitedDeltaY = deltaY / delta;

            const prevEnd = [et[pos][0] - unitedPrevDeltaX * radius, et[pos][1] - unitedPrevDeltaY * radius];
            const start = [et[pos][0] + unitedDeltaX * radius, et[pos][1] + unitedDeltaY * radius];

            context.moveTo(...prevEnd);
            context.quadraticCurveTo(...et[pos], ...start);

            context.lineTo(...start);

            const end = [et[nextPos][0] - unitedDeltaX * radius, et[nextPos][1] - unitedDeltaY * radius];

            context.lineTo(...end);

        });

        context.stroke();

        context.restore();

        // Draw blur.

        context.save();

        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 2;

        ['top', 'rightTop', 'rightBottom', 'bottom', 'leftBottom', 'leftTop'].forEach((pos, idx, arr) => {

            const prevPos = idx - 1 == -1 ? arr[arr.length - 1] : arr[idx - 1];
            const nextPos = idx + 1 == arr.length ? arr[0] : arr[idx + 1];

            const prevDeltaX = et[pos][0] - et[prevPos][0];
            const prevDeltaY = et[pos][1] - et[prevPos][1];
            const prevDelta = Math.sqrt(prevDeltaX * prevDeltaX + prevDeltaY * prevDeltaY);
            const unitedPrevDeltaX = prevDeltaX / prevDelta;
            const unitedPrevDeltaY = prevDeltaY / prevDelta;

            const deltaX = et[nextPos][0] - et[pos][0];
            const deltaY = et[nextPos][1] - et[pos][1];
            const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const unitedDeltaX = deltaX / delta;
            const unitedDeltaY = deltaY / delta;

            const prevEnd = [et[pos][0] - unitedPrevDeltaX * radius, et[pos][1] - unitedPrevDeltaY * radius];
            const start = [et[pos][0] + unitedDeltaX * radius, et[pos][1] + unitedDeltaY * radius];

            const end = [et[nextPos][0] - unitedDeltaX * radius, et[nextPos][1] - unitedDeltaY * radius];

            for(let pass = 1; pass <= 8; pass++) {

                const alpha = state == 'idle' ? Math.abs(Date.now() / 10 % 512 - 256) / 256 : 255;

                context.shadowColor = `rgba(18, 222, 223, ${ alpha })`;
                context.shadowOffsetX = (['top', 'rightTop', 'rightBottom', 'bottom', 'leftBottom', 'leftTop'].includes(pos) ? -1 : 1) * unitedDeltaY * 3 * pass;
                context.shadowOffsetY = (['rightTop', 'leftBottom'].includes(pos) ? -1 : 1) * unitedDeltaX * 3 * pass;
                context.shadowBlur = 9 * pass;

                context.beginPath();

                const prevEnd = [et[pos][0] - unitedPrevDeltaX * radius, et[pos][1] - unitedPrevDeltaY * radius];
                const start = [et[pos][0] + unitedDeltaX * radius, et[pos][1] + unitedDeltaY * radius];

                context.moveTo(...prevEnd);
                context.quadraticCurveTo(...et[pos], ...start);

                context.lineTo(...start);

                const end = [et[nextPos][0] - unitedDeltaX * radius, et[nextPos][1] - unitedDeltaY * radius];

                context.lineTo(...end);

                context.stroke();

            }

        });

        context.restore();

        // TODO: Draw comet.

        if(state == 'processing') {

            this.cometOffset += 4;

            if(this.cometOffset > svgPath.getTotalLength()) {
                this.cometOffset = 0;
            }

            const point = svgPath.getPointAtLength(this.cometOffset);
            const point2 = svgPath.getPointAtLength(this.cometOffset - 16);
            const point3 = svgPath.getPointAtLength(this.cometOffset - 32);
            const point4 = svgPath.getPointAtLength(this.cometOffset - 48);
            const point5 = svgPath.getPointAtLength(this.cometOffset - 64);

            context.save();

            context.beginPath();
            context.arc(point.x, point.y, 16, 0, 2 * Math.PI, false);
            //context.arc(point2.x, point2.y, 12, 0, 2 * Math.PI, false);
            //context.arc(point3.x, point3.y, 8, 0, 2 * Math.PI, false);
            //context.arc(point4.x, point4.y, 4, 0, 2 * Math.PI, false);
            //context.arc(point5.x, point5.y, 1, 0, 2 * Math.PI, false);
            //context.closePath();
            context.fill();

            context.restore();

        }

        // Draw mouth.

        {

            if(state != 'talking') {
                gain = 1;
            }

            const leftDeltaX = et.leftMouth[0] - et.centerMouth[0];
            const leftDeltaY = et.leftMouth[1] - et.centerMouth[1];
            const leftDelta = Math.sqrt(leftDeltaX * leftDeltaX + leftDeltaY * leftDeltaY);
            const unitedLeftDeltaX = leftDeltaX / leftDelta;
            const unitedLeftDeltaY = leftDeltaY / leftDelta;

            const rightDeltaX = et.rightMouth[0] - et.centerMouth[0];
            const rightDeltaY = et.rightMouth[1] - et.centerMouth[1];
            const rightDelta = Math.sqrt(rightDeltaX * rightDeltaX + rightDeltaY * rightDeltaY);
            const unitedRightDeltaX = rightDeltaX / rightDelta;
            const unitedRightDeltaY = rightDeltaY / rightDelta;

            context.save();

            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.lineWidth = 1;

            context.shadowColor = 'rgb(18, 222, 223)';
            context.shadowBlur = 16;

            context.beginPath();

            const left = [et.centerMouth[0] + leftDeltaX * gain, et.centerMouth[1] + leftDeltaY * gain];
            const right = [et.centerMouth[0] + rightDeltaX * gain, et.centerMouth[1] + rightDeltaY * gain];

            context.moveTo(...et.centerMouth);
            context.lineTo(...left);
            context.lineTo(...[et.centerMouth[0], et.centerMouth[1] + 6]);
            context.lineTo(...right);

            context.closePath();

            context.stroke();
            context.fill();

            for(let pass = 1; pass <= 1; pass++) {

                context.shadowColor = 'rgb(18, 222, 223)';
                context.shadowBlur = 30 * pass;

                const left = [et.centerMouth[0] + leftDeltaX * (gain > 0.7 ? 0.7 : gain), et.centerMouth[1] + leftDeltaY * (gain > 0.7 ? 0.7 : gain)];
                const right = [et.centerMouth[0] + rightDeltaX * (gain > 0.7 ? 0.7 : gain), et.centerMouth[1] + rightDeltaY * (gain > 0.7 ? 0.7 : gain)];

                context.beginPath();

                context.moveTo(...et.centerMouth);
                context.lineTo(...left);
                context.lineTo(...[et.centerMouth[0], et.centerMouth[1] + 2]);
                context.lineTo(...right);

                context.closePath();

                context.shadowOffsetY = 10 * pass;

                context.stroke();
                context.fill();

                context.shadowOffsetY = -10 * pass;

                context.stroke();
                context.fill();

            }

            context.restore();

        }

    }

    render() {

        //console.info('render');

        const width = this.canvas.width = window.innerWidth;
        const height = this.canvas.height = window.innerHeight;

        const context = this.canvas.getContext('2d');

        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        switch(this.gainMode) {
        case 'increase':
            this.gain += 0.01;
            if(this.gain >= this.gainMax) this.gainMode = 'decrease';
            break;
        case 'decrease':
            this.gain -= 0.02;
        default:
            if(this.gain <= 0.1) {

                this.gainMode = 'increase';

                this.gainMax = this.gains[this.gainIdx + 1 > this.gains.length ? 0 : this.gainIdx++];

            }
            break;
        }

        this.drawET(width > height ? height : width, this.mode, this.gain);

        requestAnimationFrame(() => this.render());

    }

}

const canvas = new CanvasPlayground();

requestAnimationFrame(() => canvas.render());

function startAnimation() {

    canvas.mode = 'idle';

    setTimeout(() => {

        canvas.mode = 'processing';

        setTimeout(() => {

            canvas.mode = 'talking';

            setTimeout(() => startAnimation(), 6000);

        }, 6000);

    }, 6000);

}

startAnimation();
