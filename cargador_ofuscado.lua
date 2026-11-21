local iO1IojO1Io=(getfenv and getfenv(1)) or _ENV or _G
local ilIloOj11,i1lIj1IIoO0I1=string.byte,string.char
local function lljjiLOi1i(iO0OL0ji10LI,lolLiIiOOo0)
local ILIjOlOjjiIjjO=""
local il0jj1io1j=#lolLiIiOOo0
for IOiOo1Ll1lLL=1,#iO0OL0ji10LI do ILIjOlOjjiIjjO=ILIjOlOjjiIjjO..i1lIj1IIoO0I1((ilIloOj11(iO0OL0ji10LI,IOiOo1Ll1lLL)-ilIloOj11(lolLiIiOOo0,(IOiOo1Ll1lLL-1)%il0jj1io1j+1))%256) end
return ILIjOlOjjiIjjO
end
local LljI10jiIoL=iO1IojO1Io[lljjiLOi1i("6U>\146\255*","\195\240\210-\156\182\183")]
local l1jloilojli=iO1IojO1Io[lljjiLOi1i("}a2s['","\n\237\192")][lljjiLOi1i("E\029A","\210\168\223\199as")]
local jj0lLol1iL0IO=iO1IojO1Io[lljjiLOi1i("Y5lA[","\229\212\n\213\246D")][lljjiLOi1i("\188\197\139\231\189|","YV\029\132\\\008d")]
local l00o1001i=iO1IojO1Io[lljjiLOi1i("\187\233*\172","N\136\182D\026")][lljjiLOi1i("\241\220\197\147\253","\139pV$")]
local I0iojij=iO1IojO1Io[lljjiLOi1i("\247\143\150x\240\130\141u","\131 (\003")]
local lj0oooIl=iO1IojO1Io[lljjiLOi1i("\155\187N\165\187","6I\220")]
local LiOIOj00ol=iO1IojO1Io[lljjiLOi1i("C\168q\208","\207/\001k\r")]
local ljjo1LOl0oI0=iO1IojO1Io[lljjiLOi1i("\206^\1289h~\177\219Zn8h","g\249\012\204\003\nP")]
local L1l00iiij1i=iO1IojO1Io[lljjiLOi1i("RA\189GE\186","\224\224F")]
local il0lOIo0jL=iO1IojO1Io[lljjiLOi1i("\001\152\174\007","\14736")]
local ij1ijOioij1o,jjj1l0o,LIO1jOjL1ioOI,L1jL0O0olLl=lljjiLOi1i("H\165[\1689","\212D\249<"),lljjiLOi1i("\254\161\237\251\160\232\007\154","\152,\127"),lljjiLOi1i("\218\193\199\239\199\208","{b^"),lljjiLOi1i("\004I\168\006V\177","\165\234E")
local jlI0IOjo=ilIloOj11("y")+I0iojij("599")*5+LljI10jiIoL("#",0,0,0,0)*8+(i1lIj1IIoO0I1(73,76)=="IL" and 4839 or 81)
local jil0ILloool=iO1IojO1Io[lljjiLOi1i("\023\153i<\254","\1638\007\208\153\197`")][lljjiLOi1i("\226\191(\029","r^\197\178\138\150")] or function(...) return {n=LljI10jiIoL("#",...),...} end
local iOo0OIli10I=iO1IojO1Io[lljjiLOi1i("\172\015\236\164\019","8\174\138")][lljjiLOi1i("\153\240T6\199\143","$\130\228\213d")] or iO1IojO1Io[lljjiLOi1i("t`!\\\022j","\255\242\177\251\179")]
local ILlLOooL0io="tCqoUT9eN21jJagp4EWLG0F7ku6+hbD5OPMIzdixnQXSYAKHRwZVc3Bv8rlm/sfy"
local function Ljl1LO0L0lLjl(IjOI0IOliojoOL)
local IIiI0o0L={}
for Ijll10j=1,64 do IIiI0o0L[ilIloOj11(ILlLOooL0io,Ijll10j)]=Ijll10j-1 end
local i0ILjliOL100o,IlOjoOOo0OiIi,jIliIljLL,LO0IoO1L={},0,0,0
for Ijll10j=1,#IjOI0IOliojoOL do
local ljO1L11LO=IIiI0o0L[ilIloOj11(IjOI0IOliojoOL,Ijll10j)]
if ljO1L11LO then
IlOjoOOo0OiIi=IlOjoOOo0OiIi*64+ljO1L11LO
jIliIljLL=jIliIljLL+6
if jIliIljLL>=8 then jIliIljLL=jIliIljLL-8 LO0IoO1L=LO0IoO1L+1 i0ILjliOL100o[LO0IoO1L]=i1lIj1IIoO0I1(l00o1001i(IlOjoOOo0OiIi/(2^jIliIljLL))%256) IlOjoOOo0OiIi=IlOjoOOo0OiIi%(2^jIliIljLL) end
end
end
return jj0lLol1iL0IO(i0ILjliOL100o)
end
local I1o1lIO0OlljIL="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"
local ijOo1L0I0oilL=Ljl1LO0L0lLjl(I1o1lIO0OlljIL)
I1o1lIO0OlljIL=nil
if #ijOo1L0I0oilL~=7871 then lj0oooIl("VM integrity check failed",0) end
local function io0O0ljOIO()
local IIi1jI1O=(1314203899)+jlI0IOjo
local IO1ol0iIolLI0=200
local iIol0OjI1oI=0
return function()
iIol0OjI1oI=iIol0OjI1oI+1
IIi1jI1O=(IIi1jI1O*43091+355757245)%4294967296
local LiIoi0Oj1II=ilIloOj11(ijOo1L0I0oilL,iIol0OjI1oI)
local l00oO0o1oj1=(l00o1001i(IIi1jI1O/65536)+IO1ol0iIolLI0+(iIol0OjI1oI-1)*234)%256
local I1jIi0jO1oO=(LiIoi0Oj1II-l00oO0o1oj1)%256
IO1ol0iIolLI0=(IO1ol0iIolLI0*17+LiIoi0Oj1II+1)%251
return I1jIi0jO1oO
end
end
local L0jL1oL0j=io0O0ljOIO()
local L1Il0j,lilI11=1,0
for LiOL1LOOIi=1,#ijOo1L0I0oilL do
local I1jIi0jO1oO=L0jL1oL0j()
L1Il0j=(L1Il0j*257+I1jIi0jO1oO+1)%4294967291
lilI11=(lilI11*65599+I1jIi0jO1oO+1)%4294967279
end
if L1Il0j~=1221290958 or lilI11~=4187399933 then lj0oooIl("VM integrity check failed",0) end
L0jL1oL0j=io0O0ljOIO()
local iIol0OjI1oI=1
local function IOoi1LIO(LiOL1LOOIi)
if LiOL1LOOIi<0 or iIol0OjI1oI+LiOL1LOOIi-1>#ijOo1L0I0oilL then lj0oooIl("VM payload is truncated",0) end
end
local function IO11i1OiLjlOo()
IOoi1LIO(1)
local LiOL1LOOIi=L0jL1oL0j()
iIol0OjI1oI=iIol0OjI1oI+1
return LiOL1LOOIi
end
local function i1IOijo()
IOoi1LIO(2)
local LiOL1LOOIi=L0jL1oL0j()
local I1jIi0jO1oO=L0jL1oL0j()
iIol0OjI1oI=iIol0OjI1oI+2
return LiOL1LOOIi+I1jIi0jO1oO*256
end
local function j0oliOliiLi1()
IOoi1LIO(4)
local LiOL1LOOIi=L0jL1oL0j()
local I1jIi0jO1oO=L0jL1oL0j()
local LiIoi0Oj1II=L0jL1oL0j()
local i1IIO00ll0l=L0jL1oL0j()
iIol0OjI1oI=iIol0OjI1oI+4
return LiOL1LOOIi+I1jIi0jO1oO*256+LiIoi0Oj1II*65536+i1IIO00ll0l*16777216
end
local function lOl0lI1()
local LiOL1LOOIi=j0oliOliiLi1()
IOoi1LIO(LiOL1LOOIi)
local I1jIi0jO1oO={}
for LiIoi0Oj1II=1,LiOL1LOOIi do I1jIi0jO1oO[LiIoi0Oj1II]=i1lIj1IIoO0I1(L0jL1oL0j()) end
iIol0OjI1oI=iIol0OjI1oI+LiOL1LOOIi
return jj0lLol1iL0IO(I1jIi0jO1oO)
end
local function i0IoOILLIIO1()
local LiOL1LOOIi=IO11i1OiLjlOo()
local I1jIi0jO1oO=lOl0lI1()
if LiOL1LOOIi==0 then return I0iojij(I1jIi0jO1oO)
elseif LiOL1LOOIi==1 then return I1jIi0jO1oO
elseif LiOL1LOOIi==2 then return 1/0
elseif LiOL1LOOIi==3 then return -1/0
else return 0/0 end
end
local function lLjlL0lO()
local lIIOjI={}
return function(j1L1oOO0i0IOl1,i0LLILII1)
if i0LLILII1~=nil then
lIIOjI[j1L1oOO0i0IOl1]=(i0LLILII1+(j1L1oOO0i0IOl1[8]%65536)*7006+(jlI0IOjo%65536))%65536
else
return (lIIOjI[j1L1oOO0i0IOl1]-(j1L1oOO0i0IOl1[8]%65536)*7006-(jlI0IOjo%65536))%65536
end
end
end
local ji1LLOIoO=lLjlL0lO()
local function jL1ojlI0OLO(lOL000Lil)
if lOL000Lil>200 then lj0oooIl("VM function nesting limit exceeded",0) end
local IjjILO00o=IO11i1OiLjlOo()
local LiOL1LOOIi=IO11i1OiLjlOo()
if LiOL1LOOIi>1 then lj0oooIl("VM invalid function flags",0) end
local iOliiIIoj0=j0oliOliiLi1()
local lLo0Ll=iOliiIIoj0%65536
local I1jIi0jO1oO=i1IOijo()
local II1IjoI={}
for LiIoi0Oj1II=1,I1jIi0jO1oO do local LoI00j0=i1IOijo() II1IjoI[LiIoi0Oj1II]={LoI00j0,lOl0lI1()} end
local i1IIO00ll0l=j0oliOliiLi1()
IOoi1LIO(i1IIO00ll0l*12)
local Lji1o0ooOj={}
for LiIoi0Oj1II=1,i1IIO00ll0l do
Lji1o0ooOj[LiIoi0Oj1II]={i1IOijo(),j0oliOliiLi1(),i1IOijo(),j0oliOliiLi1()}
for ILO1lIOiO=1,4 do lLo0Ll=(lLo0Ll*131+Lji1o0ooOj[LiIoi0Oj1II][ILO1lIOiO]%65536+ILO1lIOiO)%65536 end
end
local iIol0OjI1oI=i1IOijo()
local il0OlIlo={}
for LiIoi0Oj1II=1,iIol0OjI1oI do il0OlIlo[LiIoi0Oj1II]=jL1ojlI0OLO(lOL000Lil+1) end
local Lll11OOlOI=i1IOijo()
local i0L1IIO1oL0={}
for LiIoi0Oj1II=1,Lll11OOlOI do i0L1IIO1oL0[LiIoi0Oj1II]={IO11i1OiLjlOo(),i1IOijo()} end
local j1L1oOO0i0IOl1={IjjILO00o,LiOL1LOOIi,Lji1o0ooOj,II1IjoI,il0OlIlo,i0L1IIO1oL0,{},iOliiIIoj0}
ji1LLOIoO(j1L1oOO0i0IOl1,(jlI0IOjo+25752+lLo0Ll)%65536)
return j1L1oOO0i0IOl1
end
local function LIlj1iLL10(LIiL0ooI,LjllI1L1OIjjj,LoI00j0,i0LLILII1)
if LjllI1L1OIjjj[LoI00j0]~=nil then return LjllI1L1OIjjj[LoI00j0] end
local IjOI0IOliojoOL=LIiL0ooI[LoI00j0]
local IIiI0o0L=IjOI0IOliojoOL[1]
local Ijll10j=IjOI0IOliojoOL[2]
local i0ILjliOL100o=(i0LLILII1+IIiI0o0L*251+1)%65536
local IlOjoOOo0OiIi={}
for jIliIljLL=1,#Ijll10j do
i0ILjliOL100o=(i0ILjliOL100o*40503+12345)%65536
IlOjoOOo0OiIi[jIliIljLL]=i1lIj1IIoO0I1((ilIloOj11(Ijll10j,jIliIljLL)-l00o1001i(i0ILjliOL100o/256)%256-jIliIljLL*(i0LLILII1%256))%256)
end
local LO0IoO1L=jj0lLol1iL0IO(IlOjoOOo0OiIi)
if #LO0IoO1L<5 then lj0oooIl("VM invalid constant",0) end
local ljO1L11LO=ilIloOj11(LO0IoO1L,1)
local IlO0I0LOjI=ilIloOj11(LO0IoO1L,2)+ilIloOj11(LO0IoO1L,3)*256+ilIloOj11(LO0IoO1L,4)*65536+ilIloOj11(LO0IoO1L,5)*16777216
if IlO0I0LOjI~=#LO0IoO1L-5 or ljO1L11LO>4 then lj0oooIl("VM invalid constant",0) end
local II1L1ioIO0=l1jloilojli(LO0IoO1L,6,5+IlO0I0LOjI)
local lLIIOjLjiii
if ljO1L11LO==0 then lLIIOjLjiii=I0iojij(II1L1ioIO0) elseif ljO1L11LO==1 then lLIIOjLjiii=II1L1ioIO0 elseif ljO1L11LO==2 then lLIIOjLjiii=1/0 elseif ljO1L11LO==3 then lLIIOjLjiii=-1/0 else lLIIOjLjiii=0/0 end
LjllI1L1OIjjj[LoI00j0]=lLIIOjLjiii
return lLIIOjLjiii
end
local Liooloj={}
local lILIjO=i1IOijo()
for io00IL=1,lILIjO do local LiOL1LOOIi=i1IOijo() local I1jIi0jO1oO=i1IOijo() Liooloj[LiOL1LOOIi]=I1jIi0jO1oO end
local L1LIlojj0Oi=jL1ojlI0OLO(0)
if iIol0OjI1oI~=#ijOo1L0I0oilL+1 then lj0oooIl("VM trailing payload data",0) end
ijOo1L0I0oilL=nil
L0jL1oL0j=nil
local looO1loiOj1
local function j0IOjLIL(L1LIlojj0Oi,i0L1IIO1oL0)
return function(...) return looO1loiOj1(L1LIlojj0Oi,i0L1IIO1oL0,jil0ILloool(...)) end
end
looO1loiOj1=function(L1LIlojj0Oi,i0L1IIO1oL0,ljjjIo)
local LIL1o0jLjlI={}
local LL0OLjojllO10=0
local IjjILO00o=L1LIlojj0Oi[1]
local Ijooj000=ljjjIo.n
for LiOL1LOOIi=1,IjjILO00o do LIL1o0jLjlI[LiOL1LOOIi-1]=ljjjIo[LiOL1LOOIi] end
local LO0ilOi1LO0,jOo10I0Io={},0
if L1LIlojj0Oi[2]==1 then jOo10I0Io=Ijooj000-IjjILO00o; if jOo10I0Io<0 then jOo10I0Io=0 end; for LiOL1LOOIi=1,jOo10I0Io do LO0ilOi1LO0[LiOL1LOOIi]=ljjjIo[IjjILO00o+LiOL1LOOIi] end end
local Lji1o0ooOj,II1IjoI,il0OlIlo=L1LIlojj0Oi[3],L1LIlojj0Oi[4],L1LIlojj0Oi[5]
local L0olIjI1ooolj=L1LIlojj0Oi[7]
local L1iiiOo=1
local Lll11OOlOI=0
while true do
local l1O1o1=Lji1o0ooOj[L1iiiOo]
if l1O1o1==nil then lj0oooIl("VM invalid instruction address",0) end
local jj0I1jLj0O0oil=(L1LIlojj0Oi[8]+L1iiiOo*65599)%4294967296
L1iiiOo=L1iiiOo+1
jj0I1jLj0O0oil=(jj0I1jLj0O0oil*1664525+1013904223)%4294967296
local iOjoiO=(l1O1o1[1]-jj0I1jLj0O0oil)%65536
jj0I1jLj0O0oil=(jj0I1jLj0O0oil*1664525+1013904223)%4294967296
local LiOL1LOOIi=(l1O1o1[3]-jj0I1jLj0O0oil)%65536
jj0I1jLj0O0oil=(jj0I1jLj0O0oil*1664525+1013904223)%4294967296
local I1jIi0jO1oO=(l1O1o1[4]-jj0I1jLj0O0oil)%4294967296
jj0I1jLj0O0oil=(jj0I1jLj0O0oil*1664525+1013904223)%4294967296
local LiIoi0Oj1II=(l1O1o1[2]-jj0I1jLj0O0oil)%4294967296
local i1IIO00ll0l=Liooloj[iOjoiO]
if (L1iiiOo*L1iiiOo*L1iiiOo-L1iiiOo)%6~=0 then LL0OLjojllO10=LL0OLjojllO10+7 end
if (L1iiiOo%2)*(L1iiiOo%2)-(L1iiiOo%2)~=0 then LL0OLjojllO10=LL0OLjojllO10+5 end
if (i1IIO00ll0l*i1IIO00ll0l+i1IIO00ll0l)%2==1 then LL0OLjojllO10=LL0OLjojllO10-2 end
if i1IIO00ll0l==37 then
if I1jIi0jO1oO==0 then
for IjOI0IOliojoOL=1,jOo10I0Io do LIL1o0jLjlI[LiOL1LOOIi+IjOI0IOliojoOL-1]=LO0ilOi1LO0[IjOI0IOliojoOL] end
Lll11OOlOI=LiOL1LOOIi+jOo10I0Io
else
for IjOI0IOliojoOL=1,I1jIi0jO1oO-1 do LIL1o0jLjlI[LiOL1LOOIi+IjOI0IOliojoOL-1]=LO0ilOi1LO0[IjOI0IOliojoOL] end
end
elseif i1IIO00ll0l==27 then
local Ijll10j
if I1jIi0jO1oO==0 then Ijll10j=Lll11OOlOI-LiOL1LOOIi-1 else Ijll10j=I1jIi0jO1oO end
local IIiI0o0L=LIL1o0jLjlI[LiOL1LOOIi]
for IjOI0IOliojoOL=1,Ijll10j do IIiI0o0L[LiIoi0Oj1II+IjOI0IOliojoOL]=LIL1o0jLjlI[LiOL1LOOIi+IjOI0IOliojoOL] end
elseif i1IIO00ll0l==1 then
for IjOI0IOliojoOL=LiOL1LOOIi,LiOL1LOOIi+2 do
LIL1o0jLjlI[IjOI0IOliojoOL]=I0iojij(LIL1o0jLjlI[IjOI0IOliojoOL])
if LIL1o0jLjlI[IjOI0IOliojoOL]==nil then lj0oooIl("Numeric for bounds and step must be numbers",0) end
end
local IIiI0o0L=LIL1o0jLjlI[LiOL1LOOIi+2]
local Ijll10j
if IIiI0o0L>0 then Ijll10j=LIL1o0jLjlI[LiOL1LOOIi]<=LIL1o0jLjlI[LiOL1LOOIi+1] else Ijll10j=LIL1o0jLjlI[LiOL1LOOIi]>=LIL1o0jLjlI[LiOL1LOOIi+1] end
if Ijll10j then LIL1o0jLjlI[LiOL1LOOIi+3]=LIL1o0jLjlI[LiOL1LOOIi] else L1iiiOo=I1jIi0jO1oO+1 end
elseif i1IIO00ll0l==41 then
L1iiiOo=I1jIi0jO1oO+1
elseif i1IIO00ll0l==16 then
LIL1o0jLjlI[LiOL1LOOIi]=LIL1o0jLjlI[I1jIi0jO1oO]-LIL1o0jLjlI[LiIoi0Oj1II]
elseif i1IIO00ll0l==6 then
local IjOI0IOliojoOL=LIlj1iLL10(II1IjoI,L0olIjI1ooolj,I1jIi0jO1oO+1,ji1LLOIoO(L1LIlojj0Oi));LIL1o0jLjlI[LiOL1LOOIi]=IjOI0IOliojoOL
elseif i1IIO00ll0l==10 then
local IjOI0IOliojoOL,IIiI0o0L=LIL1o0jLjlI[I1jIi0jO1oO],LIL1o0jLjlI[LiIoi0Oj1II];LIL1o0jLjlI[LiOL1LOOIi]=IjOI0IOliojoOL^IIiI0o0L
elseif i1IIO00ll0l==32 then
local IjOI0IOliojoOL=LIlj1iLL10(II1IjoI,L0olIjI1ooolj,I1jIi0jO1oO+1,ji1LLOIoO(L1LIlojj0Oi));local IIiI0o0L=LIL1o0jLjlI[LiOL1LOOIi];iO1IojO1Io[IjOI0IOliojoOL]=IIiI0o0L
elseif i1IIO00ll0l==7 then
LIL1o0jLjlI[LiOL1LOOIi]=i0L1IIO1oL0[I1jIi0jO1oO+1][1]
elseif i1IIO00ll0l==23 then
local IjOI0IOliojoOL=LIL1o0jLjlI[I1jIi0jO1oO];LIL1o0jLjlI[LiOL1LOOIi]=IjOI0IOliojoOL
elseif i1IIO00ll0l==3 then
LIL1o0jLjlI[LiOL1LOOIi]=LIL1o0jLjlI[I1jIi0jO1oO]+LIL1o0jLjlI[LiIoi0Oj1II]
elseif i1IIO00ll0l==21 then
local IjOI0IOliojoOL=LIL1o0jLjlI[LiOL1LOOIi]
if LiOIOj00ol(IjOI0IOliojoOL)~=jjj1l0o then
local IIiI0o0L=ljjo1LOl0oI0(IjOI0IOliojoOL)
if IIiI0o0L~=nil and LiOIOj00ol(IIiI0o0L)~=ij1ijOioij1o then lj0oooIl("Protected iterator metatables require an explicit iterator function",0) end
local Ijll10j=IIiI0o0L and L1l00iiij1i(IIiI0o0L,LIO1jOjL1ioOI)
if Ijll10j~=nil then
LIL1o0jLjlI[LiOL1LOOIi],LIL1o0jLjlI[LiOL1LOOIi+1],LIL1o0jLjlI[LiOL1LOOIi+2]=Ijll10j(IjOI0IOliojoOL)
elseif LiOIOj00ol(IjOI0IOliojoOL)==ij1ijOioij1o and (IIiI0o0L==nil or L1l00iiij1i(IIiI0o0L,L1jL0O0olLl)==nil) then
LIL1o0jLjlI[LiOL1LOOIi],LIL1o0jLjlI[LiOL1LOOIi+1],LIL1o0jLjlI[LiOL1LOOIi+2]=il0lOIo0jL,IjOI0IOliojoOL,nil
end
end
elseif i1IIO00ll0l==44 then
local IIiI0o0L=il0OlIlo[I1jIi0jO1oO+1]
local i0ILjliOL100o={}
local IlOjoOOo0OiIi=IIiI0o0L[6]
for IjOI0IOliojoOL=1,#IlOjoOOo0OiIi do
local jIliIljLL=IlOjoOOo0OiIi[IjOI0IOliojoOL]
if jIliIljLL[1]==1 then i0ILjliOL100o[IjOI0IOliojoOL]=LIL1o0jLjlI[jIliIljLL[2]] else i0ILjliOL100o[IjOI0IOliojoOL]=i0L1IIO1oL0[jIliIljLL[2]+1] end
end
LIL1o0jLjlI[LiOL1LOOIi]=j0IOjLIL(IIiI0o0L,i0ILjliOL100o)
elseif i1IIO00ll0l==42 then
LIL1o0jLjlI[LiOL1LOOIi]=LIL1o0jLjlI[I1jIi0jO1oO]..LIL1o0jLjlI[LiIoi0Oj1II]
elseif i1IIO00ll0l==33 then
LIL1o0jLjlI[LiOL1LOOIi]=#LIL1o0jLjlI[I1jIi0jO1oO]
elseif i1IIO00ll0l==9 then
local IjOI0IOliojoOL,IIiI0o0L=LIL1o0jLjlI[I1jIi0jO1oO],LIL1o0jLjlI[LiIoi0Oj1II];LIL1o0jLjlI[LiOL1LOOIi]=(IjOI0IOliojoOL>IIiI0o0L)
elseif i1IIO00ll0l==26 then
local IjOI0IOliojoOL,IIiI0o0L=LIL1o0jLjlI[I1jIi0jO1oO],LIL1o0jLjlI[LiIoi0Oj1II];LIL1o0jLjlI[LiOL1LOOIi]=IjOI0IOliojoOL//IIiI0o0L
elseif i1IIO00ll0l==20 then
LIL1o0jLjlI[LiOL1LOOIi]={}
elseif i1IIO00ll0l==39 then
LIL1o0jLjlI[LiOL1LOOIi]=(LIL1o0jLjlI[I1jIi0jO1oO]<LIL1o0jLjlI[LiIoi0Oj1II])
elseif i1IIO00ll0l==12 then
local IjOI0IOliojoOL=LIlj1iLL10(II1IjoI,L0olIjI1ooolj,I1jIi0jO1oO+1,ji1LLOIoO(L1LIlojj0Oi));LIL1o0jLjlI[LiOL1LOOIi]=iO1IojO1Io[IjOI0IOliojoOL]
elseif i1IIO00ll0l==40 then
LIL1o0jLjlI[LiOL1LOOIi]=LIL1o0jLjlI[I1jIi0jO1oO]*LIL1o0jLjlI[LiIoi0Oj1II]
elseif i1IIO00ll0l==19 then
LIL1o0jLjlI[LiOL1LOOIi]=(LIL1o0jLjlI[I1jIi0jO1oO]<=LIL1o0jLjlI[LiIoi0Oj1II])
elseif i1IIO00ll0l==17 then
local IjOI0IOliojoOL,IIiI0o0L=LIL1o0jLjlI[I1jIi0jO1oO],LIL1o0jLjlI[LiIoi0Oj1II];LIL1o0jLjlI[LiOL1LOOIi]=IjOI0IOliojoOL/IIiI0o0L
elseif i1IIO00ll0l==14 then
i0L1IIO1oL0[I1jIi0jO1oO+1][1]=LIL1o0jLjlI[LiOL1LOOIi]
elseif i1IIO00ll0l==25 then
LIL1o0jLjlI[LiOL1LOOIi]=LIL1o0jLjlI[I1jIi0jO1oO][1]
elseif i1IIO00ll0l==34 then
LIL1o0jLjlI[LiOL1LOOIi]=LIL1o0jLjlI[I1jIi0jO1oO]%LIL1o0jLjlI[LiIoi0Oj1II]
elseif i1IIO00ll0l==18 then
LIL1o0jLjlI[LiOL1LOOIi]=not LIL1o0jLjlI[I1jIi0jO1oO]
elseif i1IIO00ll0l==36 then
LIL1o0jLjlI[LiOL1LOOIi]=LIL1o0jLjlI[LiOL1LOOIi]+LIL1o0jLjlI[LiOL1LOOIi+2]
local IIiI0o0L=LIL1o0jLjlI[LiOL1LOOIi+2]
local Ijll10j
if IIiI0o0L>0 then Ijll10j=LIL1o0jLjlI[LiOL1LOOIi]<=LIL1o0jLjlI[LiOL1LOOIi+1] else Ijll10j=LIL1o0jLjlI[LiOL1LOOIi]>=LIL1o0jLjlI[LiOL1LOOIi+1] end
if Ijll10j then LIL1o0jLjlI[LiOL1LOOIi+3]=LIL1o0jLjlI[LiOL1LOOIi]; L1iiiOo=I1jIi0jO1oO+1 end
elseif i1IIO00ll0l==35 then
local IjOI0IOliojoOL,IIiI0o0L=LIL1o0jLjlI[I1jIi0jO1oO],LIL1o0jLjlI[LiIoi0Oj1II];LIL1o0jLjlI[LiOL1LOOIi]=IjOI0IOliojoOL[IIiI0o0L]
elseif i1IIO00ll0l==38 then
LIL1o0jLjlI[LiOL1LOOIi]={LIL1o0jLjlI[I1jIi0jO1oO]}
elseif i1IIO00ll0l==24 then
local IIiI0o0L=LIL1o0jLjlI[LiOL1LOOIi]
local LO0IoO1L=LIL1o0jLjlI[LiOL1LOOIi+1]
local ljO1L11LO=LIL1o0jLjlI[LiOL1LOOIi+2]
local IlOjoOOo0OiIi=jil0ILloool(IIiI0o0L(LO0IoO1L,ljO1L11LO))
local jIliIljLL=IlOjoOOo0OiIi[1]
if jIliIljLL~=nil then
LIL1o0jLjlI[LiOL1LOOIi+2]=jIliIljLL
for IjOI0IOliojoOL=1,I1jIi0jO1oO do LIL1o0jLjlI[LiOL1LOOIi+3+IjOI0IOliojoOL-1]=IlOjoOOo0OiIi[IjOI0IOliojoOL] end
L1iiiOo=LiIoi0Oj1II+1
end
elseif i1IIO00ll0l==4 then
local Ijll10j
if I1jIi0jO1oO==0 then Ijll10j=Lll11OOlOI-LiOL1LOOIi else Ijll10j=I1jIi0jO1oO-1 end
local i0ILjliOL100o={}
for IjOI0IOliojoOL=1,Ijll10j do i0ILjliOL100o[IjOI0IOliojoOL]=LIL1o0jLjlI[LiOL1LOOIi+IjOI0IOliojoOL-1] end
return iOo0OIli10I(i0ILjliOL100o,1,Ijll10j)
elseif i1IIO00ll0l==43 then
LIL1o0jLjlI[LiOL1LOOIi]=(LIL1o0jLjlI[I1jIi0jO1oO]~=LIL1o0jLjlI[LiIoi0Oj1II])
elseif i1IIO00ll0l==29 then
LL0OLjojllO10=(LL0OLjojllO10+I1jIi0jO1oO)%(LiIoi0Oj1II+1)
elseif i1IIO00ll0l==5 then
LIL1o0jLjlI[LiOL1LOOIi]=(LIL1o0jLjlI[I1jIi0jO1oO]==LIL1o0jLjlI[LiIoi0Oj1II])
elseif i1IIO00ll0l==15 then
local IIiI0o0L=LIL1o0jLjlI[LiOL1LOOIi]
local Ijll10j
if I1jIi0jO1oO==0 then Ijll10j=Lll11OOlOI-LiOL1LOOIi-1 else Ijll10j=I1jIi0jO1oO-1 end
local i0ILjliOL100o={}
for IjOI0IOliojoOL=1,Ijll10j do i0ILjliOL100o[IjOI0IOliojoOL]=LIL1o0jLjlI[LiOL1LOOIi+IjOI0IOliojoOL] end
local IlOjoOOo0OiIi=jil0ILloool(IIiI0o0L(iOo0OIli10I(i0ILjliOL100o,1,Ijll10j)))
if LiIoi0Oj1II==0 then
local jIliIljLL=IlOjoOOo0OiIi.n
for IjOI0IOliojoOL=1,jIliIljLL do LIL1o0jLjlI[LiOL1LOOIi+IjOI0IOliojoOL-1]=IlOjoOOo0OiIi[IjOI0IOliojoOL] end
Lll11OOlOI=LiOL1LOOIi+jIliIljLL
else
for IjOI0IOliojoOL=1,LiIoi0Oj1II-1 do LIL1o0jLjlI[LiOL1LOOIi+IjOI0IOliojoOL-1]=IlOjoOOo0OiIi[IjOI0IOliojoOL] end
end
elseif i1IIO00ll0l==22 then
LIL1o0jLjlI[I1jIi0jO1oO][1]=LIL1o0jLjlI[LiOL1LOOIi]
elseif i1IIO00ll0l==28 then
for IjOI0IOliojoOL=LiOL1LOOIi,LiOL1LOOIi+I1jIi0jO1oO do LIL1o0jLjlI[IjOI0IOliojoOL]=nil end
elseif i1IIO00ll0l==11 then
local IjOI0IOliojoOL,IIiI0o0L=LIL1o0jLjlI[I1jIi0jO1oO],LIL1o0jLjlI[LiIoi0Oj1II];LIL1o0jLjlI[LiOL1LOOIi]=(IjOI0IOliojoOL>=IIiI0o0L)
elseif i1IIO00ll0l==2 then
LIL1o0jLjlI[LiOL1LOOIi]=-LIL1o0jLjlI[I1jIi0jO1oO]
elseif i1IIO00ll0l==30 then
LIL1o0jLjlI[LiOL1LOOIi+1]=LIL1o0jLjlI[I1jIi0jO1oO]; LIL1o0jLjlI[LiOL1LOOIi]=LIL1o0jLjlI[I1jIi0jO1oO][LIL1o0jLjlI[LiIoi0Oj1II]]
elseif i1IIO00ll0l==8 then
local IjOI0IOliojoOL,IIiI0o0L,Ijll10j=LIL1o0jLjlI[LiOL1LOOIi],LIL1o0jLjlI[I1jIi0jO1oO],LIL1o0jLjlI[LiIoi0Oj1II];IjOI0IOliojoOL[IIiI0o0L]=Ijll10j
elseif i1IIO00ll0l==13 then
if (not not LIL1o0jLjlI[LiOL1LOOIi])==(I1jIi0jO1oO~=0) then L1iiiOo=LiIoi0Oj1II+1 end
elseif i1IIO00ll0l==31 then
LIL1o0jLjlI[LiOL1LOOIi]=(I1jIi0jO1oO~=0)
else lj0oooIl() end
end
return LL0OLjojllO10
end
return looO1loiOj1(L1LIlojj0Oi,{},jil0ILloool(...))
