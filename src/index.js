// var mycanvas = document.getElementById('myCanvas');
// // var mycontext = mycanvas.getContext('2d');
// // var mygradient = mycontext.createLinearGradient(30, 30, 300, 300);
// // mygradient.addColorStop(0, "#FF0000");
// // mygradient.addColorStop(1, "#00FF00");
// // mycontext.fillStyle = mygradient;
// // mycontext.fillRect(0, 0, 400, 400);

// var mycontext = mycanvas.getContext('2d');
// var mygradient = mycontext.createRadialGradient(300, 300, 0, 300, 300, 300);
// mygradient.addColorStop("0", "magenta");
// mygradient.addColorStop(".25", "blue");
// mygradient.addColorStop(".50", "green");
// mygradient.addColorStop(".75", "yellow");
// mygradient.addColorStop("1.0", "red");
// mycontext.fillStyle = mygradient;
// mycontext.fillRect(0, 0, 400, 400);


var total = 4;
var zWin = $(window);
var wImage = $('#large_img');
var domImage = wImage[0];
var cid;
/**
 *渲染html结构
 */
var render = function() {
	var padding = 2;
	var winWidth = zWin.width();
	//返回小于等于数字参数的最大整数，对数字进行下舍入
	var picWidth = Math.floor((winWidth - padding * 3) / 4);
	var tmpl = ''; //为每次for循环缓存html代码
	for (var i = 1; i <= total; i++) {
		var p = padding;
		if (i % 4 == 1) {
			p = 0;
		}
		var imgSrc = '../images/mobile-gallery/bg' + i + '.jpg';
		//自定义data-id属性
		tmpl += '<li data-id="' + i + '" class="animated bounceIn" style="width:' + picWidth + 'px;height:' + picWidth + 'px;padding-left:' + p + 'px;padding-top:' + padding + 'px";><canvas id="cvs_' + i + '" style="width:' + picWidth + 'px;height:' + picWidth + 'px";></canvas></li>';
		var imageObj = new Image();
		imageObj.index = i;
		imageObj.onload = function() {
			// 方法返回一个用于在画布上绘图的环境,指定二维绘图
			var cvs = $('#cvs_' + this.index)[0].getContext('2d');
			cvs.width = this.width;
			cvs.height = this.height;
			cvs.drawImage(this, 0, 0); //不偏移
		}
		imageObj.src = imgSrc; //请求图片
	}
	$('#container').html(tmpl);


	/**
	 *引用事件委托，不去遍历每个img节省开销
	 */
	$('#container li').tap(function() {
		var _id = cid = $(this).attr('data-id');
		loadImg(_id);
	})

}
render();

/**
 *加载大图
 */
var loadImg = function(id, callback) {
	$('#large_container').css({
		width: zWin.width(),
		height: zWin.height()
	}).show(); //注意这种写法
	$('#container').hide();
	var imgsrc = '../images/mobile-gallery/bg' + id + '_large.jpg';
	var imageObj = new Image();
	imageObj.onload = function() {
		var w = this.width; //图片本身实际宽度
		var h = this.height;
		var winWidth = zWin.width(); //屏幕宽度
		var winHeight = zWin.height();
		var realW = winHeight * w / h; //缩放实际图片宽度
		var realH = winWidth * h / w;
		var paddingLeft = parseInt((winWidth - realW) / 2);
		var paddingTop = parseInt((winHeight - realH) / 2);
		wImage.css('width', 'auto').css('height', 'auto');
		wImage.css('padding', '0');
		//当为高度屏幕时，高度充满屏幕
		if (h / w > 1.2) {
			wImage.attr('src', imgsrc).css('height', winHeight).css('padding-left', paddingLeft);
		} else {
			wImage.attr('src', imgsrc).css('width', winWidth).css('padding-top', paddingTop);
		}
	}
	callback && callback(); //兼容性处理
	imageObj.src = imgsrc;
}



/**
 *图片翻页
 */
$('#large_container').tap(function() {
	// $(this).hide();
}).swipeRight(function() { 
	cid++;
	if (cid > total) {
		cid = total;
	} else {
		loadImg(cid, function() { //回调函数
			domImage.addEventListener('webkitAnimationEnd', function() {
				wImage.removeClass('animated bounceInLeft');
				domImage.removeEventListener('webkitAnimationEnd');
			}, false); //false阻止冒泡
			wImage.addClass('animated bounceInLeft');
		});
	}
}).swipeLeft(function() {
	cid--;
	if (cid < 1) {
		cid = 1
	} else {
		loadImg(cid, function() {
			//自定义addEventListener,防止bounceInRight事件在执行一次后失去
			domImage.addEventListener('webkitAnimationEnd', function() {
				wImage.removeClass('animated bounceInRight');
				domImage.removeEventListener('webkitAnimationEnd');
			}, false); //false阻止冒泡
			wImage.addClass('animated bounceInRight');
		})
	}
})