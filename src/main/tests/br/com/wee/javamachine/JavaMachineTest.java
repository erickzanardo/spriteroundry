package br.com.wee.javamachine;

import junit.framework.Assert;

import org.junit.Test;

import br.com.wee.javamachine.JavaCommand;
import br.com.wee.javamachine.JavaMachine;
import bsh.EvalError;

public class JavaMachineTest {
    @Test
    public void testExecute() throws EvalError {
        JavaMachine machine = new JavaMachine();

        Assert.assertEquals("", machine.execute(""));
        Assert.assertEquals("Hello Java Machine", machine.execute("console.log(\"Hello Java Machine\");"));
        Assert.assertEquals("", machine.execute("console.log(\"Hello Java Machine\");console.clear();"));

        StringBuilder commandToAssert = new StringBuilder();
        commandToAssert.append("int a = 2;");
        commandToAssert.append("int b = 3;");
        commandToAssert.append("int c = a * b;");
        commandToAssert.append("console.log(c);");
        Assert.assertEquals("6", machine.execute(commandToAssert.toString()));

        commandToAssert = new StringBuilder();
        commandToAssert.append("String word = \"This will never work!!!!\";");
        commandToAssert.append("word = word.replace(\"never \", \"\");");
        commandToAssert.append("console.log(word);");
        Assert.assertEquals("This will work!!!!", machine.execute(commandToAssert.toString()));

        commandToAssert = new StringBuilder();
        commandToAssert.append("List l = new ArrayList();");
        commandToAssert.append("l.add(\"A\");");
        commandToAssert.append("l.add(\"B\");");
        commandToAssert.append("console.log(l.get(1));");
        
        JavaCommand command = new JavaCommand(commandToAssert.toString(), new String[]{"java.util.ArrayList"});
        Assert.assertEquals("B", machine.execute(command));

        commandToAssert = new StringBuilder();
        commandToAssert.append("List l = new ArrayList();");
        commandToAssert.append("l.add(\"one \");l.add(\"shall \");l.add(\"stand \");");
        commandToAssert.append("l.add(\"one \");l.add(\"shall \");l.add(\"fall\");");
        commandToAssert.append("for (String s : l)");
        commandToAssert.append("   console.log(s);");
        
        command = new JavaCommand(commandToAssert.toString(), new String[]{"java.util.ArrayList"});
        Assert.assertEquals("one shall stand one shall fall", machine.execute(command));

        commandToAssert = new StringBuilder();
        commandToAssert.append("class Agent {public String getName(){return \"Bond, James Bond!\"; }}");
        commandToAssert.append("console.log(new Agent().getName());");
        
        command = new JavaCommand(commandToAssert.toString());
        Assert.assertEquals("Bond, James Bond!", machine.execute(command));
    }
}
