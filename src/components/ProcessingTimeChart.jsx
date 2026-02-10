import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';
import { getMap } from '../utils/workflowStore.js';

export default function ProcessingTimeChart({ contracts }) {
    const processingTimes = [];
    const workflowMap = getMap();
    
    contracts.forEach(c => {
        const workflow = workflowMap[c.numeroContrat];
        if (workflow) {
            // Use createdAt if available, otherwise fall back to contract's dateMiseEnService or current date
            const startTime = workflow.createdAt || c.dateMiseEnService || new Date().toISOString();
            
            // Use processedAt for processed contracts, updatedAt for others, or current time for active contracts
            const endTime = workflow.state === 'processed' && workflow.processedAt ? 
                workflow.processedAt : 
                workflow.updatedAt || new Date().toISOString();
            
            const duration = dayjs(endTime).diff(dayjs(startTime), 'hours');
            
            if (duration >= 0) {
                processingTimes.push({
                    numeroContrat: c.numeroContrat,
                    client: `${c.prenom} ${c.nom}`,
                    duration,
                    state: workflow.state,
                    date: dayjs(startTime).format('DD/MM/YYYY')
                });
            }
        }
    });

    const timeStats = processingTimes.reduce((acc, curr) => {
        const range = curr.duration < 1 ? '< 1h' : 
                     curr.duration < 6 ? '1-6h' : 
                     curr.duration < 24 ? '6-24h' : 
                     curr.duration < 72 ? '1-3 jours' : '> 3 jours';
        acc[range] = (acc[range] || 0) + 1;
        return acc;
    }, {});

    const processingData = Object.entries(timeStats).map(([range, count]) => ({
        range,
        count,
    })).sort((a, b) => {
        const order = ['< 1h', '1-6h', '6-24h', '1-3 jours', '> 3 jours'];
        return order.indexOf(a.range) - order.indexOf(b.range);
    });

    const averageTime = processingTimes.length > 0 ? 
        (processingTimes.reduce((sum, p) => sum + p.duration, 0) / processingTimes.length).toFixed(1) + 'h' : 
        '—';

    return (
        <Card title="Temps de traitement des contrats">
            <BarChart width={400} height={300} data={processingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, "contrats"]} />
                <Bar dataKey="count" fill="#722ed1" />
            </BarChart>
            <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
                Moyenne: {averageTime} | Total: {processingTimes.length} contrats
            </div>
        </Card>
    );
}
