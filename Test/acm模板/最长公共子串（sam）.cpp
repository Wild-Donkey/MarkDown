#include<cstdio>
#include<cstring>
#include<iostream>
using namespace std;
#define N 1500023
char s[N],wod[N];
int son[N][26],fa[N],Len[N],S=1,cc=1;
void insert(int a)
{
    int q=++cc,now=S;S=q;Len[q]=Len[now]+1;
    for (;now&&!son[now][a];now=fa[now]) son[now][a]=q;
    if (!now) fa[q]=1;
    else
    {
        int t=son[now][a];
        if (Len[now]+1==Len[t]) fa[q]=t;
        else
        {
            int Q=++cc;Len[Q]=Len[now]+1;
            memcpy(son[Q],son[t],sizeof(son[t]));
            fa[Q]=fa[t];fa[t]=fa[q]=Q;
            for (;son[now][a]==t;now=fa[now]) son[now][a]=Q;
        }
    }
}
int LCS(char S[])
{
    int len=strlen(S+1),ans=0,now=1,lcs=0;
    for (int i=1;i<=len;++i)
    {
        if (son[now][S[i]-'a']) ++lcs,now=son[now][S[i]-'a'];
        else
        {
            while(now&&!son[now][S[i]-'a']) now=fa[now];
            if (now) lcs=Len[now]+1,now=son[now][S[i]-'a'];
            else now=1,lcs=0;
        }
        ans=max(ans,lcs);
    }
    return ans;
}
int main()
{
    scanf("%s%s",s+1,wod+1);
    int len=strlen(s+1);
    for (int i=1;i<=len;++i) insert(s[i]-'a');
    printf("%d",LCS(wod));
    return 0;
}
