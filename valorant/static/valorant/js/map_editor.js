const canvas = document.getElementById("map-canvas");
const ctx = canvas.getContext("2d");
let fill_value = false, stroke_value = true;
let canvas_data = [];
ctx.lineWidth = 2;
let currentScale = 1;
let cur_map;
let curFaction = "neutral";

document.addEventListener("DOMContentLoaded", function () {
    color('blue');
    resize();
    window.onresize = resize;

    document.getElementById("selector-btn").click();

    //buttons
    document.getElementById("save-btn").addEventListener("click", save);
    document.getElementById("reset-btn").addEventListener("click", reset);
    document.getElementById("rotate-btn").addEventListener("click", rotate);
    document.getElementById("undo-btn").addEventListener("click", undo);
    document.getElementById("selector-btn").addEventListener("click", selector);
    document.getElementById("pencil-btn").addEventListener("click", pencil);
    document.getElementById("line-btn").addEventListener("click", line);
    document.getElementById("rectangle-btn").addEventListener("click", rectangle);
    document.getElementById("circle-btn").addEventListener("click", circle);

    const colors = document.getElementsByClassName("color-dropdown-box");
    for (let i=0; i < colors.length; i++){
       colors[i].addEventListener("click", function (e) {
           color(e.target.style.backgroundColor);
       })
    }

    const fonts = document.getElementsByClassName("font-dropdown-box");
    for (let i=0; i < fonts.length; i++){
       fonts[i].addEventListener("click", function (e) {
           fontSize(e.target.textContent);
       })
    }

    const facs = document.getElementsByClassName("btn-faction");
    for (let i=0; i < facs.length; i++){
       facs[i].addEventListener("click", faction)
    }

    document.ondragstart = function (e) {
        e.dataTransfer.setData('text', e.target.id);
    };

    canvas.ondragover = function (e) {
        e.preventDefault();
    };
    
    canvas.ondrop = function (e) {
        const data = e.dataTransfer.getData("text");
        const src = document.getElementById(data.replace("-show", ""));

        if (src.dataset.dragSource === "true") {
            e.preventDefault();
            [curX, curY] = getCurCoords(e);
            drawIcon(src, curX, curY, curFaction);
            canvas.onclick = function () {
                return false;
            };
            canvas_data.push({
                "type": "icon",
                "id": src.id,
                "curX": curX,
                "curY": curY,
                "width": src.width,
                "height": src.height,
                "faction": curFaction,
            })
            document.getElementById("selector-btn").click();
        }
    };

    const coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {
        const cur = coll[i];
        cur.onclick = function () {
            cur.classList.toggle("open");
            const curChild = cur.nextElementSibling;
            curChild.classList.toggle("collapsed");
        }
    }
});

function resize(event=null) {
    const windowWidth = window.innerWidth;
    if (windowWidth > 1920) {
        let scale = windowWidth / 1920;
        currentScale = scale;
        document.getElementById("maps-content").style.transform = "scale(" + scale + ")";
    }
}

function faction(event) {
    const fac = event.target.id;
    let active = document.getElementsByClassName("active-fac");
    while (active.length > 0) {
        active[0].classList.remove('active-fac');
    }
    event.target.parentNode.classList.add("active-fac");
    if (fac === "def-btn") {
        curFaction = "#23c297";
        const abilities = document.getElementsByClassName("map-icon-box");
        for (let i = 0; i < abilities.length; i++) {
            abilities[i].style.setProperty("filter", 'drop-shadow(0px 0px 5px #23c297)');
        }
        const agents = document.getElementsByClassName("agent-img");
        for (let j = 0; j < agents.length; j++) {
            agents[j].style.setProperty("filter", 'drop-shadow(0px 0px 5px #23c297)');
        }
    } else if (fac === "atk-btn") {
        curFaction = "#c93e47";
        const abilities = document.getElementsByClassName("map-icon-box");
        for (let i = 0; i < abilities.length; i++) {
            abilities[i].style.setProperty("filter", 'drop-shadow(0px 0px 5px #c93e47)');
        }
        const agents = document.getElementsByClassName("agent-img");
        for (let i = 0; i < agents.length; i++) {
            agents[i].style.setProperty("filter", 'drop-shadow(0px 0px 5px #c93e47)');
        }
    } else if (fac === "neutral-btn") {
        curFaction = "neutral";
        const abilities = document.getElementsByClassName("map-icon-box");
        for (let i = 0; i < abilities.length; i++) {
            abilities[i].style.removeProperty("filter");
        }
        const agents = document.getElementsByClassName("agent-img");
        for (let i = 0; i < agents.length; i++) {
            agents[i].style.removeProperty("filter");
        }
    }
}

function clearTools() {
    let active = document.getElementsByClassName("active");
    while (active.length > 0) {
        active[0].classList.remove('active');
    }
    canvas.onclick = function () {
        return false;
    };
    canvas.onmousedown = function () {
        return false;
    };
    canvas.onmouseup = function () {
        return false;
    };
    canvas.onmousemove = function () {
        return false;
    };
    canvas.onmouseout = function () {
        return false;
    };
}

function getCurCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / currentScale;
    const y = (e.clientY - rect.top) / currentScale;

    return [x, y];
}

function color(color_value) {
    const box = document.getElementById("color-box");
    box.style.backgroundColor = color_value;
    ctx.strokeStyle = color_value;
    ctx.fillStyle = color_value;
}

function fontSize(size) {
    const label = document.getElementById("font-size");
    label.innerHTML = size;
    ctx.lineWidth = size;
}

function reset() {
    if (cur_map !== 'undefined') {
        drawMap(cur_map);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas_data = [];
    }
}

//note tool

function note(noteBtn) {
    clearTools();
    const extraHeight = 50;

    const nCanvas = document.getElementById("notes-canvas");
    nCanvas.height = nCanvas.height + extraHeight;

    const noteNum = (document.getElementsByClassName("note-row").length + 1).toString();
    const newImg = noteImg(noteNum);
    const newImgUrl = newImg.toDataURL("image/png");

    const parent = noteBtn.parentNode;
    const newRow = document.createElement("DIV");
    newRow.classList.add("note-row");
    parent.insertBefore(newRow, noteBtn);

    const newImgNode = document.createElement("IMG");
    newImgNode.classList.add("note-number");
    newImgNode.dataset.dragSource = "true";
    newImgNode.id = "note-img-" + noteNum;
    newImgNode.src = newImgUrl;
    newImgNode.onclick = (function (_e) {
        clickIcon(newImgNode.id);
    });
    newRow.appendChild(newImgNode);

    const newInput = document.createElement("INPUT");
    newInput.type = "text";
    newInput.classList.add("input-note");
    newInput.onchange = (function (_e) {
        noteRedraw();
    });
    newRow.appendChild(newInput);

    const newExitBtn = document.createElement("BUTTON");
    newExitBtn.id = "exit-btn";
    newExitBtn.classList.add("btn", "btn-danger", "btn-delete-note");
    newExitBtn.onclick = (function (e) {

        const rows = document.getElementsByClassName("note-row");
        const removedIndex = Array.from(rows).indexOf(e.currentTarget.parentNode);

        canvas_data = canvas_data.filter(function (item) {
            return !("id" in item && item.id.includes("note-img"));
        });
        redraw(canvas_data);

        for (let i = removedIndex; i < rows.length - 1; i++) {
            const curInput = rows[i].getElementsByTagName("INPUT")[0];
            const nextInput = rows[i + 1].getElementsByTagName("INPUT")[0];
            curInput.value = nextInput.value;
        }
        rows[rows.length - 1].remove();
        nCanvas.height = nCanvas.height - extraHeight;
        noteRedraw();
    });

    const newExit = document.createElement("IMG");
    newExit.src = "/static/valorant/icons/x.svg";
    newExit.classList.add("delete-note");
    newExitBtn.appendChild(newExit);
    newRow.appendChild(newExitBtn);

}

function noteImg(num) {
    const mCanvas = document.createElement('canvas');
    mCanvas.width = 30;
    mCanvas.height = 30;
    const mctx = mCanvas.getContext('2d');

    mctx.font = "20px Helvetica";
    mctx.textAlign = 'center';
    mctx.textBaseline = 'middle';

    mctx.fillStyle = "#ffffff";
    mctx.beginPath();
    mctx.arc(
        15,
        15,
        15,
        0,
        Math.PI * 2,
        true);
    mctx.fill();
    mctx.closePath();
    mctx.filter = 'none';

    mctx.fillStyle = "#000000";
    mctx.fillText(num, 15, 15);

    return mCanvas;
}

function noteRedraw() {
    const nCanvas = document.getElementById("notes-canvas");
    const nCtx = nCanvas.getContext("2d");
    nCtx.clearRect(0, 0, nCanvas.width, nCanvas.height);

    const notes = document.getElementsByClassName("note-row");

    const rowHeight = nCanvas.height / notes.length;

    for (let i = 0; i < notes.length; i++) {
        const numberTag = notes[i].getElementsByTagName("img")[0];
        const textHeight = rowHeight * i + rowHeight / 2;
        const tagHeight = textHeight - numberTag.height / 2;
        nCtx.drawImage(numberTag, 10, tagHeight);

        const text = notes[i].getElementsByTagName("INPUT")[0];
        nCtx.fillStyle = "#ffffff";
        nCtx.textBaseline = 'middle';
        const textLines = getLines(nCtx, text.value, nCanvas.width - 75);
        const heightAdjust = 6 * (textLines.length - 1);
        for (let i = 0; i < textLines.length; i++) {
            nCtx.fillText(textLines[i], 50, textHeight - heightAdjust + i * 12);
        }
    }
}

function getLines(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

//selector tool

function selector() {
    let curX, curY, prevX, prevY;
    let hold = false;
    let icon;
    let img;
    let imgFaction;
    clearTools();

    canvas.onmousedown = function (e) {
        [prevX, prevY] = getCurCoords(e);

        for (let index = canvas_data.length - 1; index >= 0; index--) {
            const ev = canvas_data[index];
            if (ev.type === "icon") {
                const recX = [ev.curX - ev.width / 2, ev.curX + ev.width / 2];
                const recY = [ev.curY - ev.height / 2, ev.curY + ev.height / 2];
                if (recX[0] < prevX && prevX < recX[1] && recY[0] < prevY && prevY < recY[1]) {
                    hold = true;
                    icon = document.getElementById(canvas_data[index].id.replace("-show", ""));
                    imgFaction = canvas_data[index].faction;
                    canvas_data.splice(index, 1);
                    redraw(canvas_data);
                    img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    break
                }
            }
        }
    };

    canvas.onmousemove = function (e) {
        if (hold) {
            ctx.putImageData(img, 0, 0);
            [curX, curY] = getCurCoords(e);
            drawIcon(icon, curX, curY, imgFaction);
        }
    };

    canvas.onmouseup = function (_e) {
        if (hold) {
            hold = false;
            canvas_data.push({
                "type": "icon",
                "id": icon.id,
                "curX": curX,
                "curY": curY,
                "width": icon.width,
                "height": icon.height,
                "faction": imgFaction,
            })
        }
    }
}

// pencil tool

function pencil() {

    let curX, curY, prevX, prevY;
    let hold = false;
    clearTools();

    canvas.onmousedown = function (e) {
        [prevX, prevY] = getCurCoords(e);
        hold = true;

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        canvas_data.push({
            "type": "startpencil",
        })
    };

    canvas.onmousemove = function (e) {
        if (hold) {
            [curX, curY] = getCurCoords(e);
            draw();
            prevX = curX;
            prevY = curY;
        }
    };

    canvas.onmouseup = function (_e) {
        if (hold === true) {
            hold = false;
            canvas_data.push({
                "type": "endpencil",
            })
        }
    };

    canvas.onmouseout = function (_e) {
        if (hold === true) {
            hold = false;
        }
    };

    function draw() {
        ctx.lineTo(curX, curY);
        ctx.stroke();
        canvas_data.push({
            "type": "pencil",
            "startx": prevX,
            "starty": prevY,
            "endx": curX,
            "endy": curY,
            "thick": ctx.lineWidth,
            "color": ctx.strokeStyle
        });
    }
}

// line tool

function drawLine(img, headlen, startX, startY, endX, endY) {
    ctx.putImageData(img, 0, 0);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    let angle = Math.atan2(endY - startY, endX - startX);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 7), endY - headlen * Math.sin(angle - Math.PI / 7));

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 7), endY - headlen * Math.sin(angle + Math.PI / 7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(endX, endY);
    ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 7), endY - headlen * Math.sin(angle - Math.PI / 7));

    ctx.stroke();
    ctx.fill();
}

function line() {

    let img;
    let curX, curY, prevX, prevY;
    let hold = false;
    let isClicked = false;
    let timer;
    clearTools();

    canvas.onmousedown = function (e) {
        if (isClicked) {
            return;
        }
        timer = new Date().getTime();
        [prevX, prevY] = getCurCoords(e);
        img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        hold = true;
    };

    canvas.onmousemove = function (e) {
        [curX, curY] = getCurCoords(e);
        const hlen = ctx.lineWidth * 5;
        if (hold) {
            drawLine(img, hlen, prevX, prevY, curX, curY);
        }
    };

    canvas.onmouseup = function (_e) {
        const delay = new Date().getTime() - timer;
        if (delay < 100 && !isClicked) {
            isClicked = true;
            return;
        }
        if (delay > 100 || isClicked) {
            hold = false;
            isClicked = false;
            ctx.closePath();
            canvas_data.push({
                "type": "line",
                "startx": prevX,
                "starty": prevY,
                "endx": curX,
                "endy": curY,
                "thick": ctx.lineWidth,
                "color": ctx.strokeStyle
            });
        }
    };

    canvas.onmouseout = function (_e) {
        hold = false;
    };
}

// rectangle tool

function rectangle() {

    let img;
    let curX, curY, prevX, prevY;
    let hold = false;
    let isClicked = false;
    let timer;
    clearTools();

    canvas.onmousedown = function (e) {
        if (isClicked) {
            return;
        }
        timer = new Date().getTime();
        [prevX, prevY] = getCurCoords(e);
        img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        hold = true;
    };

    canvas.onmousemove = function (e) {
        [curX, curY] = getCurCoords(e);

        if (hold) {
            ctx.putImageData(img, 0, 0);
            curX = curX - prevX;
            curY = curY - prevY;
            ctx.strokeRect(prevX, prevY, curX, curY);
            if (fill_value) {
                ctx.fillRect(prevX, prevY, curX, curY);
            }
        }
    };

    canvas.onmouseup = function (_e) {
        const delay = new Date().getTime() - timer;
        if (delay < 100 && !isClicked) {
            isClicked = true;
            return;
        }
        if (curX !== prevX || curY !== prevY) {
            if (delay > 100 || isClicked) {
                hold = false;
                isClicked = false;
                canvas_data.push({
                    "type": "rectangle",
                    "startx": prevX,
                    "starty": prevY,
                    "width": curX,
                    "height": curY,
                    "thick": ctx.lineWidth,
                    "stroke": stroke_value,
                    "stroke_color": ctx.strokeStyle,
                    "fill": fill_value,
                    "fill_color": ctx.fillStyle
                });
            }
        }

    };

    canvas.onmouseout = function (_e) {
        hold = false;
    };
}

// circle tool

function circle() {

    let img;
    let curX, curY, prevX, prevY;
    let isClicked = false;
    let timer;
    let hold = false;
    clearTools();

    canvas.onmousedown = function (e) {
        if (isClicked) {
            return;
        }
        timer = new Date().getTime();
        [prevX, prevY] = getCurCoords(e);
        img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        hold = true;
    };

    canvas.onmousemove = function (e) {
        [curX, curY] = getCurCoords(e);
        if (hold) {
            ctx.putImageData(img, 0, 0);
            ctx.beginPath();
            ctx.arc(Math.abs(curX + prevX) / 2, Math.abs(curY + prevY) / 2,
                Math.sqrt(Math.pow(curX - prevX, 2) + Math.pow(curY - prevY, 2)) / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
            if (fill_value)
                ctx.fill();
        }
    };

    canvas.onmouseup = function (_e) {
        const delay = new Date().getTime() - timer;
        if (delay < 100 && !isClicked) {
            isClicked = true;
            return;
        }
        if (delay > 100 || isClicked) {
            hold = false;
            isClicked = false;
            canvas_data.push({
                "type": "circle",
                "startx": prevX,
                "starty": prevY,
                "endx": curX,
                "endy": curY,
                "thick": ctx.lineWidth,
                "stroke": stroke_value,
                "stroke_color": ctx.strokeStyle,
                "fill": fill_value,
                "fill_color": ctx.fillStyle
            });
        }
    };

    canvas.onmouseout = function (_e) {
        hold = false;
    };
}

function coloredIcon(img, x, y, faction) {
    const mCanvas = document.createElement('canvas');
    mCanvas.width = img.width;
    mCanvas.height = img.height;
    const mctx = mCanvas.getContext('2d');

    mctx.fillStyle = faction;
    mctx.fillRect(0, 0, mCanvas.width, mCanvas.height);
    mctx.globalCompositeOperation = 'destination-in';
    mctx.drawImage(img, 0, 0);

    ctx.filter = 'drop-shadow(0px 0px 5px #000000)';
    ctx.drawImage(mCanvas, x - img.width / 2, y - img.width / 2);
    ctx.filter = 'none';
}

function coloredAgent(img, x, y, faction) {
    const mCanvas = document.createElement('canvas');
    mCanvas.width = img.width;
    mCanvas.height = img.height;
    const mctx = mCanvas.getContext('2d');

    mctx.filter = 'drop-shadow(0px 0px 5px ' + faction + ')';
    mctx.drawImage(img, 0, 0);

    ctx.drawImage(mCanvas, x - img.width / 2, y - img.width / 2);
}

function drawIcon(img, x, y, faction) {
    if (faction === "neutral" || img.classList.contains("note-number")) {
        ctx.drawImage(img, x - img.width / 2, y - img.width / 2);
    } else if (img.classList.contains('hidden-agent-img')) {
        coloredAgent(img, x, y, faction)
    } else {
        coloredIcon(img, x, y, faction);
    }
}

function clickIcon(id) {
    clearTools();

    let img;
    const vis_img = document.getElementById(id);
    vis_img.classList.add('active');
    img = document.getElementById(id.replace("-show", ""));

    let curX, curY;

    canvas.onclick = function (e) {
        [curX, curY] = getCurCoords(e);
        drawIcon(img, curX, curY, curFaction);
        vis_img.classList.remove('active');
        canvas.onclick = function () {
            return false;
        };
        canvas_data.push({
            "type": "icon",
            "id": id,
            "curX": curX,
            "curY": curY,
            "width": img.width,
            "height": img.height,
            "faction": curFaction
        })
        document.getElementById("selector-btn").click();
    };
}

function separateIcons(data) {
    let icons = [];
    let other = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "icon") {
            icons.push(data[i]);
        } else {
            other.push(data[i]);
        }
    }

    return [icons, other];
}

function rotateCoords(data, angle) {
    for (let i = 0; i < data.length; i++) {
        let prevX = canvas.width / 2 - data[i].curX;
        let prevY = canvas.height / 2 - data[i].curY;
        let a = angle * Math.PI / 180;

        data[i].curX = prevX * Math.cos(a) + prevY * Math.sin(a) + canvas.width / 2;
        data[i].curY = prevY * Math.cos(a) - prevX * Math.sin(a) + canvas.height / 2;
    }
    return data;
}

function rotate() {

    let icons, other;
    [icons, other] = separateIcons(canvas_data);

    redraw(other);
    rotateSection();

    icons = rotateCoords(icons, 90);
    listDraw(icons);

    canvas_data.push({
        "type": "rotate",
    })
}

function rotateSection() {

    // Create an second in-memory canvas:
    const mCanvas = document.createElement('canvas');
    mCanvas.width = canvas.width;
    mCanvas.height = canvas.height;
    const mctx = mCanvas.getContext('2d');

    // Draw your canvas onto the second canvas
    // noinspection JSCheckFunctionSignatures
    mctx.drawImage(canvas, 0, 0);

    // Clear your main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rotate the main canvas

    // set the rotation point as center of the canvas
    // (but you can set any rotation point you desire)
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // rotate by 90 degrees (==PI/2)
    const radians = 90 / 180 * Math.PI;
    ctx.rotate(radians);


    // Draw the second canvas back to the (now rotated) main canvas:
    ctx.drawImage(mCanvas, -canvas.width / 2, -canvas.height / 2);

    // clean up -- unrotate and untranslate
    ctx.rotate(-radians);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

}

function listDraw(data) {
    data.forEach(function (item, _index) {
        shape_draw(item['type'], item);
    })
}

function redraw(data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    listDraw(data);
}

function undo() {
    const end = canvas_data.length - 1;
    if (canvas_data.length > 0 && canvas_data[end].type === "endpencil") {
        for (let index = canvas_data.length - 1; index >= 0; index--) {
            if (canvas_data[index].type === "startpencil") {
                canvas_data.length = index;
                break
            }
        }
    } else if (canvas_data.length > 0 && canvas_data[end].type === "rotate") {
        let icons = canvas_data.filter(function (value) {
            return value.type === "icon";
        });
        rotateCoords(icons, -90);
        canvas_data.pop();
    } else {
        canvas_data.pop();
    }
    let icons, other;
    [icons, other] = separateIcons(canvas_data);
    redraw(other);
    listDraw(icons);
}

function save(_e) {

    const noteCanvas = document.getElementById("notes-canvas");

    const mCanvas = document.createElement('canvas');
    mCanvas.width = canvas.width;
    mCanvas.height = canvas.height + noteCanvas.height;
    const mctx = mCanvas.getContext('2d');

    mctx.drawImage(canvas, 0, 0);
    if (noteCanvas.height > 0) {
        mctx.fillRect(0, canvas.height, noteCanvas.width, noteCanvas.height);
        mctx.drawImage(noteCanvas, 0, canvas.height);
    }

    const canvasImg = mCanvas.toDataURL();

    const win = window.open();
    win.document.write('<img src="' + canvasImg  + '" alt="Saved Image">');
}

function drawMap(id) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas_data = [];
    cur_map = id;
    const img = document.getElementById(id);
    // noinspection JSCheckFunctionSignatures
    ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
    canvas_data.push({
        "type": "map",
        "id": id,
    })
}

function shape_draw(ctool, shape) {
    if (ctool === 'pencil') {
        const bg_x = shape.startx, bg_y = shape.starty, x = shape.endx, y = shape.endy;
        ctx.lineWidth = shape.thick;
        ctx.strokeStyle = shape.color;
        ctx.beginPath();
        ctx.moveTo(bg_x, bg_y);
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (ctool === 'line') {
        const l_x = shape.startx;
        const l_y = shape.starty;
        const lend_x = shape.endx;
        const lend_y = shape.endy;
        const hlen = ctx.lineWidth * 5;
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = shape.thick;
        ctx.strokeStyle = shape.color;
        ctx.beginPath();
        drawLine(img, hlen, l_x, l_y, lend_x, lend_y);
    } else if (ctool === 'rectangle') {
        ctx.beginPath();
        ctx.strokeStyle = shape.stroke_color;
        ctx.fillStyle = shape.fill_color;
        if (shape.stroke)
            ctx.strokeRect(shape.startx, shape.starty, shape.width, shape.height);
        if (shape.fill)
            ctx.fillRect(shape.startx, shape.starty, shape.width, shape.height);
        ctx.closePath();
    } else if (ctool === 'circle') {
        ctx.beginPath();
        ctx.lineWidth = shape.thick;
        ctx.strokeStyle = shape.stroke_color;
        ctx.fillStyle = shape.fill_color;
        ctx.arc(
            Math.abs(shape.endx + shape.startx) / 2,
            Math.abs(shape.endy + shape.starty) / 2,
            Math.sqrt(Math.pow(shape.endx - shape.startx, 2) + Math.pow(shape.endy - shape.starty, 2)) / 2,
            0,
            Math.PI * 2,
            true);
        if (shape.stroke)
            ctx.stroke();
        if (shape.fill)
            ctx.fill();
        ctx.closePath();
    } else if (ctool === 'map') {
        const img = document.getElementById(shape.id);
        // noinspection JSCheckFunctionSignatures
        ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.width / 2 - img.width / 2);
    } else if (ctool === 'icon') {
        let img = document.getElementById(shape.id.replace("-show", ""));
        drawIcon(img, shape.curX, shape.curY, shape.faction);
    } else if (ctool === 'rotate') {
        rotateSection();
    }
}