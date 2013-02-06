var SunCalc = SunCalc || function (year, month, day, latitude, longitude) {
	var y = year,
		m = month,
		d = day,
		lt = latitude,
		lg = longitude,
		zenith = 90 + 50 / 60,
		p = this.prototype = {
			calc: function(y, m, d, lt, lg, zenith) {
				var n1, n2, n3, n, lngHour, t, m, l, ra, lQuad, rQuad, sinDec, cosDec, cosH, h, time, ut, tempTime, localTime;
				n1 = Math.floor(275 * m / 9);
				n2 = Math.floor((m + 9) / 12);
				n3 = (1 + Math.floor((y - 4 * Math.floor(y / 4) + 2) / 3));
				n = n1 - (n2 * n3) + d - 30;
				lngHour = lg / 15;
				var obj = {sunrise:"", sunset:"", culmination:"", sunriseHour:"", sunsetHour:""};
				var RorS = [6, 18];
				for (var i in RorS) {
					t = n + ((RorS[i] - lngHour) / 24);
					m = (0.9856 * t) - 3.289;
					l = (m + (1.916 * this.sin(m)) + (0.020 * this.sin(2 * m)) + 282.634) % 360;
					ra = this.atan(0.91764 * this.tan(l)) % 360;
					lQuad = (Math.floor(l / 90)) * 90;
					rQuad = (Math.floor(ra / 90)) * 90;
					ra = (ra + (lQuad - rQuad)) / 15;
					sinDec = 0.39782 * this.sin(l);
					cosDec = this.cos(this.asin(sinDec));
					cosH = (this.cos(zenith) - (sinDec * this.sin(lt))) / (cosDec * this.cos(lt));
					h = ((i == 0) ? 360 - this.acos(cosH) : this.acos(cosH)) / 15;
					time = h + ra - (0.06571 * t) - 6.622;
					ut = (time - lngHour) % 24;
					tempTime = ut + lngHour;
					localTime = (tempTime >= 24) ? (tempTime - 24) : ((tempTime < 0) ? (tempTime + 24) : tempTime);
					if (i == 0) {
						obj.sunriseHour = localTime;
						obj.sunrise = timeToHHMM(localTime);
					} else {
						obj.sunsetHour = localTime;
						obj.sunset = timeToHHMM(localTime);
					}
				}
				function timeToHHMM(time) {
					var hours = time.toString().split(".")[0];
					var minutes = String(Number(time.toString().split(".")[1]) * 0.6).substr(0, 2);
					minutes = (minutes < 10) ? "0" + minutes : minutes;
					return hours + ":" + minutes;
				}
				obj.culmination = timeToHHMM(((obj.sunsetHour - obj.sunriseHour) / 2) + obj.sunriseHour);
				return obj;
			},
			sin: function (deg) {
				return Math.sin(deg * Math.PI / 180);
			},
			cos: function (deg) {
				return Math.cos(deg * Math.PI / 180);
			},
			tan: function (deg) {
				return Math.tan(deg * Math.PI / 180);
			},
			asin: function (x) {
				return (180 / Math.PI) * Math.asin(x);
			},
			acos: function (x) {
				return (180 / Math.PI) * Math.acos(x);
			},
			atan: function (x) {
				return (180 / Math.PI) * Math.atan(x);
			}
		};
	return p.calc(y, m, d, lt, lg, zenith);
}