'use client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Phone, Mail, Building2, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { agentApi } from '@/lib/api';

export default function AgentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => agentApi.getAll({ limit: 20 }).then(r => r.data),
  });

  const agents = data?.agents || [];

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="bg-primary-50 dark:bg-primary-950/30 py-12">
          <div className="container-page text-center">
            <h1 className="font-display font-bold text-3xl lg:text-4xl text-neutral-900 dark:text-white mb-3">Find a trusted agent</h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">Connect with verified real estate professionals across Kosovo</p>
          </div>
        </div>
        <div className="container-page py-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length:6}).map((_,i)=><div key={i} className="card p-6 space-y-3"><div className="skeleton w-16 h-16 rounded-full" /><div className="skeleton h-4 w-32" /><div className="skeleton h-3 w-24" /></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent: any) => (
                <div key={agent.id} className="card-hover p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      {agent.user.avatar
                        ? <Image src={agent.user.avatar} alt={agent.user.firstName} width={64} height={64} className="rounded-full object-cover" />
                        : <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300 text-lg">{agent.user.firstName[0]}</div>
                      }
                      {agent.isVerified && <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-primary-600 bg-white rounded-full" />}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-neutral-900 dark:text-white">{agent.user.firstName} {agent.user.lastName}</h3>
                      {agent.agency && <p className="text-xs text-neutral-500 dark:text-neutral-400">{agent.agency.name}</p>}
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{agent.rating}</span>
                        <span className="text-xs text-neutral-400">({agent.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {agent._count?.listings || 0} listings</span>
                    <span>{agent.yearsExperience} yrs exp</span>
                  </div>
                  {agent.specializations?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {agent.specializations.slice(0,3).map((s:string)=><span key={s} className="badge-blue text-[10px]">{s}</span>)}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/agents/${agent.id}`} className="btn-primary btn-sm flex-1">View profile</Link>
                    {agent.user.phone && <a href={`tel:${agent.user.phone}`} className="btn-secondary btn-sm w-9 p-0 justify-center"><Phone className="w-4 h-4" /></a>}
                    <a href={`mailto:${agent.user.email}`} className="btn-secondary btn-sm w-9 p-0 justify-center"><Mail className="w-4 h-4" /></a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
