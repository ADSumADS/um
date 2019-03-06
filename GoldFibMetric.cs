using System;
using System.Collections.Generic;

namespace GoldFibMetric
{
    class Program
    {
        static void Main(string[] args)
        {
            var fib=new List<int>   {1,1};
            var au=new List<decimal>{0,1};

            for(int i=2;i<32;i++)
            {
                fib.Add(fib[i-1]+ fib[i-2]);
                au.Add( fib[i-1]/(fib[i-2]*1M));
            }

            Console.WriteLine($"{"Golden Ratio",30} | {"Fibonacci Miles",15} | Kilometers");

            for(int i=0;i<fib.Count;i++)//1 Mile = 1.609344 Kilometers
                Console.WriteLine($"{au[i],30} | {fib[i],15} | {fib[i]*1.609344}");
       }
    }
}

/*
                              Golden Ratio | Fibonacci Miles | Kilometers
                                         0 |               1 | 1.609344
                                         1 |               1 | 1.609344
                                         1 |               2 | 3.218688
                                         2 |               3 | 4.828032
                                       1.5 |               5 | 8.04672
            1.6666666666666666666666666667 |               8 | 12.874752
                                       1.6 |              13 | 20.921472
                                     1.625 |              21 | 33.796224
            1.6153846153846153846153846154 |              34 | 54.717696
            1.619047619047619047619047619  |              55 | 88.51392
            1.6176470588235294117647058824 |              89 | 143.231616
            1.6181818181818181818181818182 |             144 | 231.745536
            1.6179775280898876404494382022 |             233 | 374.977152
            1.6180555555555555555555555556 |             377 | 606.722688
            1.6180257510729613733905579399 |             610 | 981.69984
            1.6180371352785145888594164456 |             987 | 1588.422528
            1.6180327868852459016393442623 |            1597 | 2570.122368
            1.6180344478216818642350557244 |            2584 | 4158.544896
            1.6180338134001252348152786475 |            4181 | 6728.667264
            1.6180340557275541795665634675 |            6765 | 10887.21216
            1.6180339631667065295383879455 |           10946 | 17615.879424
            1.61803399852180339985218034   |           17711 | 28503.091584
            1.6180339850173579389731408734 |           28657 | 46118.971008
            1.6180339901755970865563773926 |           46368 | 74622.062592
            1.6180339882053250514708448198 |           75025 | 120741.0336
            1.6180339889579020013802622498 |          121393 | 195363.096192
            1.6180339886704431856047984005 |          196418 | 316104.129792
            1.6180339887802426828565073769 |          317811 | 511467.225984
            1.618033988738303006852732438  |          514229 | 827571.355776
            1.6180339887543225376088304055 |          832040 | 1339038.58176
            1.6180339887482036213437981911 |         1346269 | 2166609.937536
            1.6180339887505408393827219845 |         2178309 | 3505648.519296
*/