## 説明
標準正規分布に従う母集団から標本を取り出した際の不偏標準偏差と標本の数の分布を算出します。

標本を取り出す時にはBox-Muller法を用いて正規分布に従う擬似乱数を生成し、サンプルの平均値を算出して、サンプルの不偏標準偏差を算出します。

乱数生成の関数
```javascript
// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}
```
グラフはサンプル数ごとに標準偏差のヒストグラムを表示しています。


計算結果から標本の数が増えるにつれて、標本の標準偏差のピークが母集団の標準偏差に近づいていくことが確認できます。また、ヒストグラムから標本調査で母集団の標準偏差を推定するために必要な標本数を考えることもできます。


## 使い方
1. [https://spinachpasta.github.io/DistributionOfDeviation/](https://spinachpasta.github.io/DistributionOfDeviation/)を開く。
または、
[Githubリポジトリ](https://github.com/spinachpasta/DistributionOfDeviation)からダウンロードしローカルでブラウザーからindex.htmlを開く。

2. index.htmlのページに表示されているリンクからページを選ぶ
* standard deviation (stdev.html):不偏標準偏差の分布
* standard deviation 2 (stdev2.html):不偏標準偏差の平均値とサンプル数の関係
* average (diff.html):平均値の分布
* average of squared (averageOfSquared.html):変量の２乗平均（分散ではない）

## 参考文献
[Box-Muller法 https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve](https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve)
