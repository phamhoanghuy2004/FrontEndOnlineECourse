import TestDetailHero from "../../components/sections/TestSetDetail/TestSetHero";
import { useLocation, Navigate } from 'react-router-dom';

const TestDetailPage = () => {
    const location = useLocation();
    const data = location.state;

    if (!data) {
        return (
            <div className="min-h-screen bg-white">
                <TestDetailHero data={{
                    title: "Dữ Liệu Mẫu (Do F5)",
                    description: "Dữ liệu bị mất do reload trang",
                    image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/616172523_2637666399941669_5416493300576885571_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHk6oraPyrs4bPz_xETbhw2HFw_ZcTDuyQcXD9lxMO7JDDENnvVSA4GWTXYrabmYmliVoDpPlCnLbQNBVP0nJzd&_nc_ohc=be1UKsM2N7YQ7kNvwFB4gWR&_nc_oc=AdlA2yMdxeZFc3Cj4tB0IpSgtoOTwsJSGwwaMcrgiwlciIXWdukYWzr5HkIfGMA7YAc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=yVssFuCGZM_Wl9PM_qMB7g&oh=00_AfpvPwyIp9BmMwQ-pQzWKSw_3KXGp7mvpmYLoVKda4Knmg&oe=696FF482"
                }} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <TestDetailHero data={data} />
        </div>
    );
};

export default TestDetailPage;