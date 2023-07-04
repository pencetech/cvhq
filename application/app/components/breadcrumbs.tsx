"use client";
import { FC } from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb } from 'antd';

const Breadcrumbs: FC = () => {
    
    const pathname = usePathname();

    const generateItems = () => {
        const asPathNoQuery = pathname.split("?")[0];
        const asPathNestedRoutes = asPathNoQuery
            .split("/")
            .filter(v => v.length > 0);
        
        let crumbList = asPathNestedRoutes.map((subpath, idx) => {
            // We can get the partial nested route for the crumb
            // by joining together the path parts up to this point.
            const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
            // The title will just be the route string for now
            const title = subpath.charAt(0) + subpath.slice(1);
            return { href, title }; 
        });

        // TODO: delete this once routing is fixed
        crumbList = crumbList.slice(1);

        return crumbList.map((crumb, i) => {
            return (<Breadcrumb.Item key={i} href={crumb.href}>
                {crumb.title}
            </Breadcrumb.Item>);
        })
    };

    return (
        <Breadcrumb 
        aria-label="Default breadcrumb example"
        style={{ margin: '16px 0' }}
        >
            {generateItems()}
        </Breadcrumb>
    );
}


export default Breadcrumbs;